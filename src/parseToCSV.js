window.parseData = (data) => {
    const report = data.report;
    let returnValue = "";
    returnValue += "type," + report.type + "\n";
    returnValue += "elements," + report.elements[0].name + "\n";
    returnValue += "reportSuite,id," + report.reportSuite.id + "\n";
    returnValue += ",name," + report.reportSuite.name + "\n";
    returnValue += "Period," + report.period + "\n";
    returnValue += "segments,id," + report.segments[0].id + "\n";
    returnValue += ",name," + report.segments[0].name + "\n";
    returnValue += "data" + "\n";
    returnValue += "Time,Count,URL" + "\n";
    report.data.forEach((element) => {
        returnValue += element.name + "," + element.counts + "," + element.url + "\n";
    })
    returnValue += "Totals," + report.totals
    return returnValue;
};