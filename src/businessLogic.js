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
            console.log("Error: report config object is not ready!")
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
        const userName = userConfig.name;
        const sharedSecret = userConfig.sharedSecret;
        const body = window.getReport.requestBody(reportConfig);
        const endpoint = reportConfig.endpoint;
        window.MarketingCloud.makeRequest(userName, sharedSecret, "Report.Queue", body, endpoint, function(e) {
            console.log("Report Queue Response: " + e.responseText);
            const reportID = JSON.parse(e.responseText).reportID;
            console.log("reportID: " + reportID);
            const newBody = body;
            newBody.reportID = reportID;
            window.getReport.fetch(userConfig, reportConfig, newBody);
        });
    },
    fetch: (userConfig, reportConfig, newBody) => {
        let retryCount = 0;
        const retryLimit = 3;
        const userName = userConfig.name;
        const sharedSecret = userConfig.sharedSecret;
        const endpoint = reportConfig.endpoint;
        window.MarketingCloud.makeRequest(userName, sharedSecret, "Report.Get", newBody, endpoint, function(e) {
            if (JSON.parse(e.responseText).error === "report_not_ready" && retryCount < retryLimit) {
                setTimeout(() => {
                    window.getReport.fetch(newBody);
                }, 20000);
                retryCount++;
            } else if (e.responseText && JSON.parse(e.responseText).report) {
                const returnValue = window.parseData.returnCSV(JSON.parse(e.responseText));
                window.fs.writeFile("./reports/" + newBody.reportID + ".csv", returnValue, (err, data) => {
                    if (err) {
                        console.log(err);
                    }
                });
                console.log(returnValue);
            } else if (retryCount >= retryLimit) {
                console.log("Error: could not view report after " + retryLimit + " retries!");
            } else {
                console.log("Error:" + e.responseText);
            }
        });
    }
};