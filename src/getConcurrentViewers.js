const fs = require("fs");
const testHTML = `
<!DOCTYPE html>
<html>
<head>
</head>
<body>
</body>
</html>
`;
const {
    JSDOM
} = require('jsdom');
const jsdom = new JSDOM(testHTML);
const {
    window
} = jsdom;
const {
    document
} = window;
global.window = window;
global.document = document;
const $ = global.jQuery = require('jquery');
require("./wsse.js");
require("./marketing_cloud.js");
require("./user.js");
require("./report.js");

const rsid = window.report.rsid; // your RSID name
const segmentId = window.report.segmentId; // insert your segment id here
const startDate = window.report.startDate; // your start date in YYYY-MM-DD format
const endDate = window.report.endDate; // your end date in YYYY-MM-DD format
const userName = window.user.name;
const sharedSecret = window.user.sharedSecret;
const method = "Report.Get"; // determines the type of API request (you can leave this alone)
const endpoint = "api.omniture.com"; // Adobe's San Jose datacentre (api2.omniture.com = Dallas, api3.omniture.com = London, api4.omniture.com = Singapore)
let reportID = "";
const body = {
    "reportID": reportID.reportID,
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
        // "segments": [{
        //     "id": segmentId
        // }],
        "sortBy": "instances",
        "locale": "en_US"
    }
};

window.MarketingCloud.makeRequest(userName, sharedSecret, "Report.Queue", body, endpoint, function(e) {
    reportID = JSON.parse(e.responseText).reportID;
});

// window.MarketingCloud.makeRequest(userName, sharedSecret, method, body, endpoint, function(e) {
//     console.log(e.responseText)
// });