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