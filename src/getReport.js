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
} = require("jsdom");
const jsdom = new JSDOM(testHTML);
const {
    window
} = jsdom;
const {
    document
} = window;
global.window = window;
global.document = document;
window.fs = require("file-system");
global.jQuery = require("jquery");
require("./adobeDependencies/wsse.js");
require("./adobeDependencies/marketing_cloud.js");
require("./config/user.js");
require("./config/report.js");
const businessLogic = require("./businessLogic.js");

businessLogic.getReport.init(window.user, window.report);