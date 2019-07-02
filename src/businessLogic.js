const utils = require("./utils.js");
const MarketingCloud = require("./adobeDependencies/marketing_cloud.js");
const fs = require("file-system");
const parseData = require("./parseData.js");
const forEachAsync = require("foreachasync");

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
        // queue each report with Adobe
        const queueAdobe = getReport.queueAdobe(userConfig, reportConfig, "Report.Queue", requestBodies[0]);
        const capiSchedules = getReport.checkCapi(reportConfig, requestBodies[0]);
        const timeoutPromise = new Promise(function(resolve, reject) {
            setTimeout(resolve, reportConfig.reportTimeout);
        });

        Promise.all([queueAdobe, capiSchedules, timeoutPromise]).then((values) => {
            const reportBody = values[0];
            const returnedSchedule = values[1];
            getReport.getAdobe(userConfig, reportConfig, reportBody).then((report) => {
                const returnHeader = parseData.generateHeader(reportBody, report);
                const bodyObject = parseData.generateBody(reportBody, report, returnedSchedule);
                const returnBody = parseData.generateReport(bodyObject);
                getReport.writeReport(reportConfig, report, returnHeader, returnBody);
            });
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
                const URL = "http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/" + reportConfig.capi.channel + "-G/schedules?StartTime=" + requestBody.reportDescription.dateFrom + "T00:00:00&EndTime=" + requestBody.reportDescription.dateTo + "T00:00:00";
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
            MarketingCloud.makeRequest(userConfig, reportConfig, "Report.Queue", requestBody).then((data) => {
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
    getAdobe: (userConfig, reportConfig, body) => {
        return new Promise((resolve, reject) => {
            MarketingCloud.makeRequest(userConfig, reportConfig, "Report.Get", body).then((data) => {
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