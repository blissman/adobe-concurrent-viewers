const utils = require("./utils.js");
const MarketingCloud = require("./adobeDependencies/marketing_cloud.js");
const fs = require("file-system");
const parseData = require("./parseData.js");
const forEachAsync = require("foreachasync").forEachAsync;
const capiConfig = require("./capiConfig.js");
const md5 = require("./md5.js");

const getReport = {
    reportValue: "",
    init: (userConfig, reportConfig) => {
        // guard against bad configs
        if (!userConfig || typeof(userConfig) !== "object" || !reportConfig || typeof(reportConfig) !== "object") {
            console.log("Error: user or report config is invalid!");
            return false;
        }
        // generate request bodies from the config
        const requestBodies = getReport.requestBody(reportConfig);
        // establish arrays for storing your reportBodies, capiSchedules, reports, and processes
        const reportBodies = [];
        const capiSchedules = [];
        const adobeReports = [];
        const processes = [];
        // queue each report with Adobe
        const queueAdobe = forEachAsync(requestBodies, (element) => {
            getReport.queueAdobe(userConfig, reportConfig, "Report.Queue", element).then((reportBody) => {
                // return report bodies with report ids
                reportBodies.push(reportBody);
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                resolve(reportBodies);
            });
        });
        processes.push(queueAdobe);
        // get your capi schedules
        if (reportConfig && reportConfig.capi && reportConfig.capi.isEnabled) {
            const getCapi = forEachAsync(requestBodies, (element) => {
                getReport.checkCapi(reportConfig, element).then((capiSchedule) => {
                    capiSchedules.push(capiSchedule);
                });
            }).then(() => {
                return new Promise((resolve, reject) => {
                    resolve(capiSchedules);
                });
            });

            processes.push(getCapi)
        }
        // set a timeout while Adobe processes your reports
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(resolve, reportConfig.reportTimeout);
        });
        processes.push(timeoutPromise);

        Promise.all(processes).then((values) => {
            const reportBodiesArray = values[0];

            forEachAsync(reportBodiesArray, (reportBody) => {
                adobeReports.push(getReport.getAdobe(userConfig, reportConfig, "Report.Get", reportBody));
            }).then(() => {
                Promise.all(adobeReports).then((values) => {
                    const bodyArray = [];
                    // generate the header for the report
                    const returnHeader = parseData.generateHeader(reportConfig, values[0]);
                    // combine your Adobe reports into a single object
                    const combinedReport = parseData.getCombinedReport(values);
                    // combine your schedules into a single object
                    const combinedSchedule = parseData.getCombinedSchedule(capiSchedules);
                    // generate the final reports from the original request bodies
                    requestBodies.forEach((request) => {
                        bodyArray.push(parseData.generateBody(request, combinedReport, combinedSchedule));
                    });
                    // flatten the report body array into a single object
                    const combinedBody = parseData.getCombinedBody(bodyArray);
                    // generate the final report from the combined body
                    const returnBody = parseData.generateReport(combinedBody);
                    //write the report
                    getReport.writeReport(reportConfig, values[0], returnHeader, returnBody);

                });
            });
        }).catch((error) => {
            console.log(error);
        });
    },
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
            const year = reportConfig.year.toString();
            const month = utils.formatMonth(reportConfig.month);
            const totalDays = utils.getDays(reportConfig.month, reportConfig.year);
            const nextMonthValue = utils.formatMonth(reportConfig.month + 1);

            for (let i = 1; i <= totalDays; i++) {
                const startDate = utils.formatDate(i);
                let endDate;

                if (i < totalDays) {
                    endDate = year + "-" + month + "-" + utils.formatDate(i + 1);
                } else if (i === totalDays) {
                    endDate = year + "-" + nextMonthValue + "-" + utils.formatDate(1);
                }

                const body = {
                    "reportDescription": {
                        "reportSuiteID": rsid,
                        "dateFrom": year + "-" + month + "-" + startDate,
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
            }
        }

        return bodyArray;
    },
    checkCapi: (reportConfig, requestBody) => {
        return new Promise((resolve, reject) => {
            if (reportConfig && reportConfig.capi && reportConfig.capi.isEnabled && typeof(reportConfig.capi.channel) === "string") {
                const URL = capiConfig.getURL(reportConfig.capi.channel, requestBody.reportDescription.dateFrom, requestBody.reportDescription.dateTo);
                utils.makeRequest(URL).then(
                    (data) => {
                        const returnArray = [];
                        const scheduleArray = JSON.parse(data.responseText).Items;

                        scheduleArray.forEach((element) => {
                            const showName = element.Name + " - " + element.Title;
                            const showDescription = element.Desc;
                            const startTime = new Date(element.StartTime).getTime() / 1000;
                            const endTime = new Date(element.EndTime).getTime() / 1000;
                            returnArray.push({
                                showName: showName,
                                showDescription: showDescription,
                                startTime: startTime,
                                endTime: endTime
                            });
                        });

                        resolve(returnArray);
                    }
                ).catch(
                    (error) => {
                        console.log(error);
                    }
                );
            } else {
                reject(false);
            }
        });
    },
    queueAdobe: (userConfig, reportConfig, reportType, requestBody) => {
        return new Promise((resolve, reject) => {
            MarketingCloud.makeRequest(userConfig, reportConfig, reportType, requestBody).then((data) => {
                if (JSON.parse(data.responseText).reportID) {
                    const reportID = JSON.parse(data.responseText).reportID;
                    requestBody.reportID = reportID;
                    resolve(requestBody);
                } else {
                    reject(false);
                }
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    },
    getAdobe: (userConfig, reportConfig, reportType, body) => {
        return new Promise((resolve, reject) => {
            MarketingCloud.makeRequest(userConfig, reportConfig, reportType, body).then((data) => {
                if (data.responseText && JSON.parse(data.responseText).report) {
                    resolve(JSON.parse(data.responseText));
                } else {
                    reject(false);
                }
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    },
    writeReport: (reportConfig, data, header, body) => {
        if (!reportConfig && reportConfig.type !== "monthly" && reportConfig.type !== "daily") {
            console.log("Error: writeReport - invalid reportConfig type!");
            return false;
        }
        const type = reportConfig.type;
        const reportData = data.report;
        let segmentName;
        if (reportData.segments && reportData.segments[0] && reportData.segments.length === 1) {
            segmentName = reportData.segments[0].name + "(" + reportData.segments[0].id + ")";
        } else if (reportData.segments && reportData.segments.length > 1) {
            const segmentsArray = [];
            reportData.segments.forEach((segment) => {
                segmentsArray.push(segment.id);
            });
            const joinedSegmentIds = segmentsArray.join("");
            segmentName = reportData.segments[0].name + "(" + md5(joinedSegmentIds) + ")";
        } else {
            segmentName = reportData.reportSuite.name + "(" + reportData.reportSuite.id + ")";
        }
        let reportName;

        if (type === "daily") {
            reportName = segmentName + " - " + reportData.period;
        } else if (type === "monthly") {
            reportName = segmentName + " - " + utils.getMonthName(reportConfig.month) + ", " + reportConfig.year;
        }

        const reportText = header + body;

        fs.writeFile("./reports/" + reportName + ".csv", reportText, (err, data) => {
            if (err) {
                console.log(err);
            }
        });

        return reportText;
    }
};

module.exports = getReport;