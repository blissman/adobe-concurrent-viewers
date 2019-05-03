const fs = require("fs");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = jQuery = require('jquery')(window);
require("./marketing_cloud.js");
require("./wsse.js");

const userName = "userName";// insert your user name in here
const sharedSecret = "sharedSecret"; // insert your shared secret here
const segmentId = "someSegmentId";