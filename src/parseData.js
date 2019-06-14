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
        header += "Time,Unix Timestamp,Count,URL,showName,showDescription" + "\n";
        return header;
    },
    generateBody: (data, capiSchedule) => {
        const report = data.report;
        const processObject = {};
        report.data.forEach((element) => {
            const unixTime = new Date(element.name).getTime() / 1000;
            processObject[unixTime] = {
                "time": element.name,
                "concurrentViewers": element.counts,
                "URL": element.url
            };
            if (capiSchedule && capiSchedule[unixTime] && capiSchedule[unixTime]) {
                processObject[unixTime].showName = capiSchedule[unixTime].showName;
                processObject[unixTime].showDescription = capiSchedule[unixTime].showDescription;
            }
        });

        return processObject;
    },
    generateReport: (body) => {
        const timeArray = Object.keys(body);
        let report = "";

        timeArray.forEach((element) => {
            report += body[element].time + "|" + element + "|" + body[element].concurrentViewers + "|" + body[element].URL + "|" + (body[element].showName || "") + "|" + (body[element].showDescription || "") + "\n";
        });

        return report;
    }
};

module.exports = parseData;