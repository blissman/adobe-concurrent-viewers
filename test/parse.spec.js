describe("parse to csv", () => {

    const data = {
        "report": {
            "type": "ranked",
            "elements": [{
                "id": "videoconcurrentviewers",
                "name": "Video Concurrent Viewers"
            }],
            "reportSuite": {
                "id": "bellmediatsnprod",
                "name": "TSN - Prod"
            },
            "period": "Thu.  2 May 2019 - Fri.  3 May 2019",
            "metrics": [{
                "id": "instances",
                "name": "Instances",
                "type": "number",
                "decimals": 0,
                "latency": 2602,
                "current": false
            }],
            "segments": [{
                "id": "s300008103_5cccaa0d85d04262783da2e6",
                "name": "TSN Live Streams"
            }],
            "data": [{
                "name": "00:24 2019-05-02",
                "url": "",
                "counts": ["237"]
            }, {
                "name": "00:25 2019-05-02",
                "url": "",
                "counts": ["236"]
            }, {
                "name": "00:23 2019-05-02",
                "url": "",
                "counts": ["236"]
            }, {
                "name": "00:26 2019-05-02",
                "url": "",
                "counts": ["235"]
            }],
            "totals": ["321749"],
            "version": "1.4.18.10"
        },
        "waitSeconds": 0,
        "runSeconds": 0
    };

    it("should parse the json to csv", () => {
        expect(window.parseData.returnCSV(data)).toEqual(
            "type,ranked\nelements,Video Concurrent Viewers\nreportSuite,id,bellmediatsnprod\n,name,TSN - Prod\nPeriod,Thu.  2 May 2019 - Fri.  3 May 2019\nsegments,id,s300008103_5cccaa0d85d04262783da2e6\n,name,TSN Live Streams\ndata\nTime,Count,URL\n00:24 2019-05-02,237,\n00:25 2019-05-02,236,\n00:23 2019-05-02,236,\n00:26 2019-05-02,235,\n"
        );
    });

    it("should return false if getReport.requestBody() is called without a report config object set", () => {
        expect(window.getReport.requestBody()).toBeFalsy();
    });

    it("should return a body object if getReport.requestBody() is called with a report config object set", () => {
        const report = {
            rsid: "testrsid",
            segmentId: "s311108103_5cccaa0d85d04262783da2e6",
            startDate: "2019-03-12",
            endDate: "2019-03-13"
        };
        const result = {
            "reportDescription": {
                "reportSuiteID": "testrsid",
                "dateFrom": "2019-03-12",
                "dateTo": "2019-03-13",
                "metrics": [{
                    "id": "instances"
                }],
                "elements": [{
                    "id": "videoconcurrentviewers",
                    "top": "2880"
                }],
                "segments": [{
                    "id": "s311108103_5cccaa0d85d04262783da2e6"
                }],
                "sortBy": "instances",
                "locale": "en_US"
            }
        };
        expect(window.getReport.requestBody(report)).toEqual(result);
        delete report;
        delete result;
    });

});