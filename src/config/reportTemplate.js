const report = {
    rsid: "exampleRSID", // your RSID name
    segmentId: ["someSegmentId"], // insert your segment ids here as an array of strings, otherwise an empty string for no segment (note: this combines segments--it does not run them separately)
    type: "daily", // can be daily or monthly
    month: 5, // 1-12 representing January-December: the month for monthly reports
    year: 2019, // the desired year for monthly reports
    startDate: "2018-07-09", // your start date in YYYY-MM-DD format for daily reports
    endDate: "2018-07-10", // your end date in YYYY-MM-DD format for daily reports
    endpoint: "api.omniture.com", // Adobe's San Jose datacentre (api2.omniture.com = Dallas, api3.omniture.com = London, api4.omniture.com = Singapore)
    reportTimeout: 30000, // time to wait (ms) between reports to allow Adobe to generate them (default is 30 seconds, increase if you're getting report errors)
    maxDataPoints: 2880 // this sets the limit on how many data points to pull (default is 2880, increase to get more data points)
};

module.exports = report;