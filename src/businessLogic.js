window.parseData = {
    generateHeader: (data) => {
        const report = data.report;
        let header = "";
        header += "type," + report.type + "\n";
        header += "elements," + report.elements[0].name + "\n";
        header += "reportSuite,id," + report.reportSuite.id + "\n";
        header += ",name," + report.reportSuite.name + "\n";
        header += "Period," + report.period + "\n";
        header += "segments,id," + report.segments[0].id + "\n";
        header += ",name," + report.segments[0].name + "\n";
        header += "data" + "\n";
        header += "Time,Count,URL" + "\n";
        return header;
    },
    generateBody: (data) => {
        const report = data.report;
        let body = "";
        report.data.forEach((element) => {
            body += element.name + "," + element.counts + "," + element.url + "\n";
        });
        return body;
    },
    returnCSV: (data) => {
        let CSV = "";
        CSV += window.parseData.generateHeader(data);
        CSV += window.parseData.generateBody(data);
        return CSV;
    }
};

window.getReport = {
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
                        "top": "2880"
                    }],
                    "segments": [{
                        "id": segmentId
                    }],
                    "sortBy": "instances",
                    "locale": "en_US"
                }
            };
            bodyArray.push(body);
        } else if (type === "monthly") {
            const reportYear = reportConfig.year;
            const reportMonth = reportConfig.month;
            const totalDays = window.utils.getDays(reportMonth, reportYear);
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
                            "top": "2880"
                        }],
                        "segments": [{
                            "id": segmentId
                        }],
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

        const requestBodies = window.getReport.requestBody(reportConfig);
        requestBodies.forEach((element) => {
            window.MarketingCloud.makeRequest(userConfig, reportConfig, "Report.Queue", element).then((data) => {
                const reportID = JSON.parse(data.responseText).reportID;
                element.reportID = reportID;
                console.log(element);
                // get the report
                window.setTimeout(() => {
                    window.getReport.fetch(userConfig, reportConfig, element);
                }, 15000);
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
                    window.getReport.fetch(userConfig, reportConfig, body);
                }, 15000);
                retryCount++;
            } else if (data.responseText && JSON.parse(data.responseText).report) {
                if (window.getReport.reportValue === "") {
                    window.getReport.reportValue += window.parseData.generateHeader(JSON.parse(data.responseText));
                    window.setTimeout(() => {
                        window.fs.writeFile("./reports/" + JSON.parse(data.responseText).report.type + " - " + JSON.parse(data.responseText).report.period + ".csv", window.getReport.reportValue, (err, data) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }, 10000);
                }
                window.getReport.reportValue += window.parseData.generateBody(JSON.parse(data.responseText));
            } else if (retryCount >= retryLimit) {
                console.log("Error: could not view report after " + retryLimit + " retries!");
            } else {
                console.log("Error: " + data.responseText);
            }
        }).catch((error) => {
            console.log(error);
        });
    }
};

window.utils = {
    getDays: (month, year) => {
        if (!month || !year || typeof(month) !== "number" || typeof(year) !== "number" || month < 1 || month > 12) {
            console.log("Error: month or year is invalid!");
            return false;
        }
        const yearArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (year % 4 === 0) {
            yearArray[1] = 29;
        }

        return yearArray[month - 1];
    }
};