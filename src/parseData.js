const parseData = {
    generateHeader: (data, reportConfig) => {
        const report = data.report;
        let header = "";
        header += "Type|" + report.type + "\n";
        header += "Elements|" + report.elements[0].name + "\n";
        header += "Report Suite|id|" + report.reportSuite.id + "\n";
        header += "|name|" + report.reportSuite.name + "\n";
        header += "Period|";
        if (reportConfig && reportConfig.type === "monthly") {
            header += utils.getMonthName(reportConfig.month) + " - " + reportConfig.year + "\n";
        } else {
            header += report.period + "\n";
        }
        if (report.segments) {
            header += "Segments|id|";
            report.segments.forEach((element) => {
                header += element.id + " ";
            });
            header += "\n";
            header += "|Name|";
            report.segments.forEach((element) => {
                header += element.name + " ";
            });
            header += "\n";
        }
        header += "Data" + "\n";
        header += "Time|Unix Timestamp|Count|URL|showName|showDescription" + "\n";
        return header;
    },
    generateBody: (request, adobe, capiSchedule) => {
        const report = adobe.report;
        const processObject = {};
        const startTime = new Date(request.reportDescription.dateFrom + "T00:00:00").getTime() / 1000;
        console.log(startTime);
        const endTime = new Date(request.reportDescription.dateTo + "T00:00:00").getTime() / 1000;
        console.log(endTime);
        report.data.forEach((element) => {
            const unixTime = new Date(element.name).getTime() / 1000;
            if (unixTime >= startTime && unixTime < endTime) {
                const capiShow = parseData.getCapiShow(capiSchedule, unixTime);
                processObject[unixTime] = {
                    "time": element.name,
                    "concurrentViewers": element.counts,
                    "URL": element.url
                };
                if (capiShow && capiShow.showName && capiShow.showDescription) {
                    processObject[unixTime].showName = capiShow.showName;
                    processObject[unixTime].showDescription = capiShow.showDescription;
                }
            }
        });

        return processObject;
    },
    getCapiShow: (schedule, unixTime) => {
        const showTime = parseInt(unixTime);
        let showInfo = false;
        schedule.forEach((element) => {
            if (showTime >= element.startTime && showTime < element.endTime) {

                showInfo = {
                    "showName": element.showName,
                    "showDescription": element.showDescription
                };

            };
        });

        return showInfo;
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