const utils = require("./utils.js");

const parseData = {
    generateHeader: (data, reportConfig) => {
        const report = data.report;
        let header = "";
        header += "Type," + report.type + "\n";
        header += "Elements," + report.elements[0].name + "\n";
        header += "Report Suite,id," + report.reportSuite.id + "\n";
        header += ",name," + report.reportSuite.name + "\n";
        header += "Period,";
        if (reportConfig && reportConfig.type === "monthly") {
            header += utils.getMonthName(reportConfig.month) + " - " + reportConfig.year + "\n";
        } else {
            header += report.period + "\n";
        }
        if (report.segments) {
            header += "Segments,id,";
            report.segments.forEach((element) => {
                header += element.id + " ";
            });
            header += "\n";
            header += ",Name,";
            report.segments.forEach((element) => {
                header += element.name + " ";
            });
            header += "\n";
        }
        header += "Data" + "\n";
        header += "Time,Unix Timestamp,Count,URL" + "\n";
        return header;
    },
    generateBody: (data) => {
        const report = data.report;
        let body = "";
        let processObject = {};
        report.data.forEach((element) => {
            const unixTime = new Date(element.name).getTime() / 1000;
            processObject[unixTime] = {
                "time": element.name,
                "concurrentViewers": element.counts,
                "URL": element.url
            }
        });

        return processObject;
    },
    generateReport: (body) => {
        const timeArray = Object.keys(body);
        let report = "";

        timeArray.forEach((element) => {
            report += body[element].time + "," + element + "," + body[element].concurrentViewers + "," + body[element].URL + "\n";
        });

        return report;
    }
};

const getReport = {
    reportValue: "",
    requestBody: (reportConfig) => {
        if (!reportConfig || typeof(reportConfig) !== "object") {
            console.log("Error: report config object is not ready!");
            return false;
        }
        const type = reportConfig.type;
        let startDate;
        let endDate;
        const bodyArray = [];
        const rsid = reportConfig.rsid;
        const segmentId = reportConfig.segmentId;
        if (type === "daily") {
            startDate = reportConfig.startDate;
            endDate = reportConfig.endDate;
            const body = {
                "reportDescription": {
                    "reportSuiteID": rsid,
                    "dateFrom": startDate,
                    "dateTo": endDate,
                    "metrics": [{
                        "id": "instances"
                    }],
                    "elements": [{
                        "id": "videoconcurrentviewers",
                        "top": reportConfig.maxDataPoints.toString()
                    }],
                    "segments": utils.getSegments(segmentId),
                    "sortBy": "instances",
                    "locale": "en_US"
                }
            };
            bodyArray.push(body);
        } else if (type === "monthly") {
            const reportYear = reportConfig.year;
            const reportMonth = reportConfig.month;
            const totalDays = utils.getDays(reportMonth, reportYear);
            const yearValue = reportYear.toString();
            let monthValue;
            if (reportMonth.toString().length === 1) {
                monthValue = "0" + reportMonth.toString();
            } else {
                monthValue = reportMonth.toString();
            }
            for (let i = 1; i < totalDays; i++) {
                let startDate;
                let endDate;

                if (i.toString().length === 1) {
                    startDate = "0" + i.toString();
                } else {
                    startDate = i.toString();
                }

                if ((i + 1).toString().length === 1) {
                    endDate = "0" + (i + 1).toString();
                } else {
                    endDate = (i + 1).toString();
                }

                const body = {
                    "reportDescription": {
                        "reportSuiteID": rsid,
                        "dateFrom": yearValue + "-" + monthValue + "-" + startDate,
                        "dateTo": yearValue + "-" + monthValue + "-" + endDate,
                        "metrics": [{
                            "id": "instances"
                        }],
                        "elements": [{
                            "id": "videoconcurrentviewers",
                            "top": reportConfig.maxDataPoints.toString()
                        }],
                        "segments": utils.getSegments(segmentId),
                        "sortBy": "instances",
                        "locale": "en_US"
                    }
                };
                bodyArray.push(body);
            }
        }
        return bodyArray;
    },
    init: (userConfig, reportConfig) => {
        if (!userConfig || typeof(userConfig) !== "object" || !reportConfig || typeof(reportConfig) !== "object") {
            console.log("Error: user or report config is invalid!");
            return false;
        }

        const requestBodies = getReport.requestBody(reportConfig);
        requestBodies.forEach((element) => {
            window.MarketingCloud.makeRequest(userConfig, reportConfig, "Report.Queue", element).then((data) => {
                const reportID = JSON.parse(data.responseText).reportID;
                element.reportID = reportID;
                console.log(element);
                // get the report
                window.setTimeout(() => {
                    getReport.fetch(userConfig, reportConfig, element);
                }, reportConfig.reportTimeout);
            }).catch((error) => {
                console.log(error);
            });
        });

    },
    fetch: (userConfig, reportConfig, body) => {
        window.MarketingCloud.makeRequest(userConfig, reportConfig, "Report.Get", body).then((data) => {
            let retryCount = 0;
            const retryLimit = 3;
            if (JSON.parse(data.responseText).error === "report_not_ready" && retryCount < retryLimit) {
                setTimeout(() => {
                    getReport.fetch(userConfig, reportConfig, body);
                }, reportConfig.reportTimeout);
                retryCount++;
            } else if (data.responseText && JSON.parse(data.responseText).report) {
                if (getReport.reportValue === "") {
                    getReport.reportValue += parseData.generateHeader(JSON.parse(data.responseText), reportConfig);
                    window.setTimeout(() => {
                        getReport.writeReport(reportConfig, data);
                    }, reportConfig.reportTimeout);
                }
                getReport.reportValue += parseData.generateReport(parseData.generateBody(JSON.parse(data.responseText)));
            } else if (retryCount >= retryLimit) {
                console.log("Error: could not view report after " + retryLimit + " retries!");
            } else {
                console.log("Error: " + data.responseText);
            }
        }).catch((error) => {
            console.log(error);
        });
    },
    writeReport: (reportConfig, data) => {
        if (!reportConfig && reportConfig.type !== "monthly" && reportConfig.type !== "daily") {
            console.log("Error: writeReport - invalid reportConfig type!");
            return false;
        }

        const type = reportConfig.type;
        const reportData = JSON.parse(data.responseText).report;
        let segmentName;
        if (reportData.segments && reportData.segments[0] && reportData.segments.length === 1) {
            segmentName = reportData.segments[0].name + "(" + reportData.segments[0].id + ")";
        } else {
            segmentName = reportData.reportSuite.name + "(" + reportData.reportSuite.id + ")";
        }
        let reportName;

        if (type === "daily") {
            reportName = segmentName + " - " + reportData.period;
        } else if (type === "monthly") {
            reportName = segmentName + " - " + utils.getMonthName(reportConfig.month) + ", " + reportConfig.year;
        }

        window.fs.writeFile("./reports/" + reportName + ".csv", getReport.reportValue, (err, data) => {
            if (err) {
                console.log(err);
            }
        });

        return getReport.reportValue;
    }
};

module.exports.getReport = getReport;
module.exports.parseData = parseData;