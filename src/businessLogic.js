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
        let returnValue = "";
        returnValue += window.parseData.generateHeader(data);
        returnValue += window.parseData.generateBody(data);
        return returnValue;
    }
};

window.getReport = {
    requestBody: (reportConfig) => {
        if (!reportConfig) {
            console.log("Error: report config object is not ready!")
            return false;
        }
        const rsid = reportConfig.rsid; // your RSID name
        const segmentId = reportConfig.segmentId; // insert your segment id here
        const startDate = reportConfig.startDate; // your start date in YYYY-MM-DD format
        const endDate = reportConfig.endDate; // your end date in YYYY-MM-DD format
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
    }
};