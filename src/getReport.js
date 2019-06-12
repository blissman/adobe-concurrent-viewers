const {
    JSDOM
} = require("jsdom");
const {
    window
} = new JSDOM();
const {
    document
} = window;
global.window = window;
global.document = document;
const user = require("./config/user.js");
const report = require("./config/report.js");
const getReport = require("./businessLogic.js");

getReport.init(user, report);