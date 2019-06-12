const utils = require("./utils.js");
const MarketingCloud = require("./adobeDependencies/marketing_cloud.js");
const fs = require("file-system");
const parseData = require("./parseData.js");

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
        // guard against bad configs
        if (!userConfig || typeof(userConfig) !== "object" || !reportConfig || typeof(reportConfig) !== "object") {
            console.log("Error: user or report config is invalid!");
            return false;
        }
        // generate request bodies from the config
        const requestBodies = getReport.requestBody(reportConfig);
        // for each request body, get the associated capi schedule and Adobe Report
        requestBodies.forEach((element) => {
            const capiResponse = getReport.checkCapi(reportConfig, element);
            const adobeResponse = getReport.queueAdobe(userConfig, reportConfig, "Report.Queue", element).then((requestBody) => {
                window.setTimeout(() => {
                    getReport.getAdobe(userConfig, reportConfig, requestBody).then((data) => {
                        return data;
                    });
                }, reportConfig.reportTimeout);
            });

            Promise.all([capiResponse, adobeResponse]).then((values) => {
                // add capi values to a master object
                // add Adobe values to a master object
                console.log(values)
            });
        });

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
                            const returnArrayElement = {
                                showName: showName,
                                showDescription: showDescription,
                                startTime: startTime
                            };

                            returnArray.push(returnArrayElement);
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
            });
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

        fs.writeFile("./reports/" + reportName + ".csv", getReport.reportValue, (err, data) => {
            if (err) {
                console.log(err);
            }
        });

        return getReport.reportValue;
    }
};

module.exports.getReport = getReport;