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
    requestBody: (reportConfig) => {
        if (!reportConfig || typeof(reportConfig) !== "object") {
            console.log("Error: report config object is not ready!");
            return false;
        }
        const rsid = reportConfig.rsid;
        const segmentId = reportConfig.segmentId;
        const startDate = reportConfig.startDate;
        const endDate = reportConfig.endDate;
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
        return body;
    },
    init: (userConfig, reportConfig) => {
        if (!userConfig || typeof(userConfig) !== "object" || !reportConfig || typeof(reportConfig) !== "object") {
            console.log("Error: user or report config is invalid!");
            return false;
        }

        const reportType = reportConfig.type;
        let body = {};
        if (reportType === "daily") {
            body = window.getReport.requestBody(reportConfig);
            window.MarketingCloud.makeRequest(userConfig, reportConfig, "Report.Queue", body).then((data) => {
                const reportID = JSON.parse(data.responseText).reportID;
                body.reportID = reportID;
                // get the report
                window.getReport.fetch(userConfig, reportConfig, body);
            }).catch((error) => {
                console.log(error);
            });
        } else if (reportType === "monthly") {
            const month = reportConfig.month;
            // figure out how to loop monthly reports here
        }
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
                const report = window.parseData.returnCSV(JSON.parse(data.responseText));
                console.log(report);
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