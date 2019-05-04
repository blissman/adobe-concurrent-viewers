const fs = require("fs");
const testHTML = `
<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <input type="text" id="fiptest">
</body>
</html>
`;
const { JSDOM } = require( 'jsdom' );
const jsdom = new JSDOM( testHTML );
const { window } = jsdom;
const { document } = window;
global.window = window;
global.document = document;
const $ = global.jQuery = require( 'jquery' );
require("./marketing_cloud.js");

/*
    These are the mandatory inputs
*/
/*********************************************************************/
const userName = "userName"; // insert your user name in here
const sharedSecret = "sharedSecret"; // insert your shared secret here
const segmentId = "someSegmentId"; // insert your segment id here
/*********************************************************************/
/*
    Optional configuration constants (you shouldn't need to worry about these unless something's wrong with your query)
*/
const method = "Company.GetReportSuites"; // determines the type of API request (you can leave this alone)
const endpoint = "api.omniture.com"; // Adobe's San Jose datacentre (api2.omniture.com = Dallas, api3.omniture.com = London, api4.omniture.com = Singapore)
const body = {}; // the request body (input your report parameters here)

window.MarketingCloud.makeRequest(userName, sharedSecret, method, body, endpoint, function(e) {
    console.log(e.responseText)
});