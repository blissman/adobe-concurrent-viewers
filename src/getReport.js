const { JSDOM } = require("jsdom");
const { window } = new JSDOM();
const { document } = window;
global.window = window;
global.document = document;
const user = require("./config/user.js");
const report = require("./config/report.js");
const businessLogic = require("./businessLogic.js");

businessLogic.getReport.init(user, report);