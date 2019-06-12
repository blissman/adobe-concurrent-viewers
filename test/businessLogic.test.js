const businessLogic = require("../src/businessLogic.js");
const parseData = require("../src/parseData.js");

describe("businesslogic", () => {

    beforeEach(() => {
        spyOn(businessLogic.getReport, "requestBody").and.callThrough();
        spyOn(businessLogic.getReport, "getAdobe").and.callThrough();
        window.MarketingCloud = {};
        window.MarketingCloud.makeRequest = () => {
            return new Promise((resolve, reject) => {
                resolve(true);
                reject(false);
            });
        };
    });

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
                "name": "00:26 2019-05-02",
                "url": "",
                "counts": ["235"]
            }, {
                "name": "00:25 2019-05-02",
                "url": "",
                "counts": ["236"]
            }, {
                "name": "00:23 2019-05-02",
                "url": "",
                "counts": ["236"]
            }],
            "totals": ["321749"],
            "version": "1.4.18.10"
        },
        "waitSeconds": 0,
        "runSeconds": 0
    };

    const duplicateData = {
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
                "name": "00:26 2019-05-02",
                "url": "",
                "counts": ["235"]
            }, {
                "name": "00:25 2019-05-02",
                "url": "",
                "counts": ["236"]
            }, {
                "name": "00:25 2019-05-02",
                "url": "",
                "counts": ["15"]
            }, {
                "name": "00:23 2019-05-02",
                "url": "",
                "counts": ["236"]
            }],
            "totals": ["321749"],
            "version": "1.4.18.10"
        },
        "waitSeconds": 0,
        "runSeconds": 0
    };

    const user = {
            name: "gerald.butts@canada.ca:Federal Government",
            sharedSecret: "0be47a0a1aab316891eeae4e6555551b"
        };

    const report = {
            rsid: "testrsid",
            segmentId: ["s311108103_5cccaa0d85d04262783da2e6"],
            type: "daily",
            month: 5,
            year: 2019,
            startDate: "2019-03-12",
            endDate: "2019-03-13",
            endpoint: "api.omniture.com", // Adobe's San Jose datacentre (api2.omniture.com = Dallas, api3.omniture.com = London, api4.omniture.com = Singapore)
            reportTimeout: 30000, // time to wait (ms) between reports to allow Adobe to generate them (default is 30 seconds, increase if you're getting report errors)
            maxDataPoints: 2880 // this sets the limit on how many data points to pull (default is 2880)
        };

    const monthlyReport = {
            rsid: "testrsid",
            segmentId: ["s311108103_5cccaa0d85d04262783da2e6"],
            type: "monthly",
            month: 5,
            year: 2019,
            startDate: "2019-03-12",
            endDate: "2019-03-13",
            endpoint: "api.omniture.com", // Adobe's San Jose datacentre (api2.omniture.com = Dallas, api3.omniture.com = London, api4.omniture.com = Singapore)
            reportTimeout: 30000, // time to wait (ms) between reports to allow Adobe to generate them (default is 30 seconds, increase if you're getting report errors)
            maxDataPoints: 5000 // this sets the limit on how many data points to pull (default is 2880)
        };


    const result = [{
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
    }];

    it("should return false if getReport.requestBody() is called without a report config object", () => {
        expect(businessLogic.getReport.requestBody(undefined)).toBeFalsy();
        expect(businessLogic.getReport.requestBody(null)).toBeFalsy();
        expect(businessLogic.getReport.requestBody(() => {})).toBeFalsy();
        expect(businessLogic.getReport.requestBody(32)).toBeFalsy();
        expect(businessLogic.getReport.requestBody("string")).toBeFalsy();
    });

    it("should return a body object if getReport.requestBody() is called with a report config object set", () => {
        expect(businessLogic.getReport.requestBody(report)).toEqual(result);
    });

    it("should return a monthly body object if getReport.requestBody() is called with a report config object set", () => {
        expect(businessLogic.getReport.requestBody(monthlyReport)).toBeTruthy();
        expect(businessLogic.getReport.requestBody(monthlyReport).length).toEqual(30);
    });

    it("should return false if init is called with invalid user and/or report configurations", () => {
        expect(businessLogic.getReport.init(undefined, report)).toBeFalsy();
        expect(businessLogic.getReport.init(null, report)).toBeFalsy();
        expect(businessLogic.getReport.init(() => {}, report)).toBeFalsy();
        expect(businessLogic.getReport.init(32, report)).toBeFalsy();
        expect(businessLogic.getReport.init("string", report)).toBeFalsy();
        expect(businessLogic.getReport.init(user, undefined)).toBeFalsy();
        expect(businessLogic.getReport.init(user, null)).toBeFalsy();
        expect(businessLogic.getReport.init(user, () => {})).toBeFalsy();
        expect(businessLogic.getReport.init(user, 32)).toBeFalsy();
        expect(businessLogic.getReport.init(user, "string")).toBeFalsy();
    });

    it("should generate a request body if init is called with valid user and report configurations", () => {
        businessLogic.getReport.init(user, report);
        expect(businessLogic.getReport.requestBody).toHaveBeenCalledWith({
            rsid: 'testrsid',
            segmentId: ['s311108103_5cccaa0d85d04262783da2e6'],
            type: "daily",
            month: 5,
            year: 2019,
            startDate: '2019-03-12',
            endDate: '2019-03-13',
            reportTimeout: 30000,
            maxDataPoints: 2880,
            endpoint: "api.omniture.com"
        });
    });

    it("should generate different header values for monthly and daily reports", () => {
        expect(parseData.generateHeader(data, report)).toEqual("Type,ranked\nElements,Video Concurrent Viewers\nReport Suite,id,bellmediatsnprod\n,name,TSN - Prod\nPeriod,Thu.  2 May 2019 - Fri.  3 May 2019\nSegments,id,s300008103_5cccaa0d85d04262783da2e6 \n,Name,TSN Live Streams \nData\nTime,Unix Timestamp,Count,URL\n");
        expect(parseData.generateHeader(data, monthlyReport)).toEqual("Type,ranked\nElements,Video Concurrent Viewers\nReport Suite,id,bellmediatsnprod\n,name,TSN - Prod\nPeriod,May - 2019\nSegments,id,s300008103_5cccaa0d85d04262783da2e6 \n,Name,TSN Live Streams \nData\nTime,Unix Timestamp,Count,URL\n");
    });


    it("should parse the data body into CSV format", () => {
        const body = {
            "1556770980": {
                "URL": "",
                "concurrentViewers": ["236"],
                "time": "00:23 2019-05-02"
            },
            "1556771040": {
                "URL": "",
                "concurrentViewers": ["237"],
                "time": "00:24 2019-05-02"
            },
            "1556771100": {
                "URL": "",
                "concurrentViewers": ["236"],
                "time": "00:25 2019-05-02"
            },
            "1556771160": {
                "URL": "",
                "concurrentViewers": ["235"],
                "time": "00:26 2019-05-02"
            }
        };

        const report = "00:23 2019-05-02,1556770980,236,\n00:24 2019-05-02,1556771040,237,\n00:25 2019-05-02,1556771100,236,\n00:26 2019-05-02,1556771160,235,\n";
        expect(parseData.generateBody(data)).toEqual(body);
        expect(parseData.generateReport(body)).toEqual(report);
    });

    it("should parse the data body into CSV format without duplicating times", () => {
        const body = {
            "1556770980": {
                "URL": "",
                "concurrentViewers": ["236"],
                "time": "00:23 2019-05-02"
            },
            "1556771040": {
                "URL": "",
                "concurrentViewers": ["237"],
                "time": "00:24 2019-05-02"
            },
            "1556771100": {
                "URL": "",
                "concurrentViewers": ["15"],
                "time": "00:25 2019-05-02"
            },
            "1556771160": {
                "URL": "",
                "concurrentViewers": ["235"],
                "time": "00:26 2019-05-02"
            }
        };

        const report = "00:23 2019-05-02,1556770980,236,\n00:24 2019-05-02,1556771040,237,\n00:25 2019-05-02,1556771100,15,\n00:26 2019-05-02,1556771160,235,\n";
        expect(parseData.generateBody(duplicateData)).toEqual(body);
        expect(parseData.generateReport(body)).toEqual(report);
    });
});