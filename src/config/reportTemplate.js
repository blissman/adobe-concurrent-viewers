const report = [
    {
        rsid: "exampleRSID", // your RSID name
        segmentId: ["someSegmentId"], // insert your segment ids here as an array of strings, otherwise remote the key for no segment (note: this combines segments--it does not run them separately)
        type: "daily", // can be daily or monthly
        dailyConfig: {
            startDate: "2018-07-09", // your start date in YYYY-MM-DD format for daily reports
            endDate: "2018-07-10" // your end date in YYYY-MM-DD format for daily reports
        },
        monthlyConfig: {
            month: 5, // 1-12 representing January-December: the month for monthly reports
            year: 2019 // the desired year for monthly reports
        },
        endpoint: "api.omniture.com", // Adobe's San Jose datacentre (api2.omniture.com = Dallas, api3.omniture.com = London, api4.omniture.com = Singapore)
        reportTimeout: 30000, // time to wait (ms) between reports to allow Adobe to generate them (default is 30 seconds, increase if you're getting report errors)
        maxDataPoints: 5760, // this sets the limit on how many data points to pull (default is 5760, increase to get more data points)
        capi: {
            isEnabled: false, // enable to call against capi to get your schedule name
            channel: "someChannel" // TSN1, RDS, CRAVE4, HBO2, STARZ3, CTV2, etc. For region specific CTV segments, refer to this schedule guide here: https://capi.9c9media.com/destinations/ctv_web/platforms/desktop/channelaffiliates?$include=[code] and import the code into the capiConfig.js file accordingly.
        }
    },
    {
        rsid: "exampleRSID", // your RSID name
        segmentId: ["someSegmentId"], // insert your segment ids here as an array of strings, otherwise an empty string for no segment (note: this combines segments--it does not run them separately)
        type: "daily", // can be daily or monthly
        dailyConfig: {
            startDate: "2018-07-09", // your start date in YYYY-MM-DD format for daily reports
            endDate: "2018-07-10" // your end date in YYYY-MM-DD format for daily reports
        },
        monthlyConfig: {
            month: 5, // 1-12 representing January-December: the month for monthly reports
            year: 2019 // the desired year for monthly reports
        },
        endpoint: "api.omniture.com", // Adobe's San Jose datacentre (api2.omniture.com = Dallas, api3.omniture.com = London, api4.omniture.com = Singapore)
        reportTimeout: 30000, // time to wait (ms) between reports to allow Adobe to generate them (default is 30 seconds, increase if you're getting report errors)
        maxDataPoints: 5760, // this sets the limit on how many data points to pull (default is 5760, increase to get more data points)
        capi: {
            isEnabled: false, // enable to call against capi to get your schedule name
            channel: "someChannel" // TSN1, RDS, CRAVE4, HBO2, STARZ3, CTV2, etc. For region specific CTV segments, refer to this schedule guide here: https://capi.9c9media.com/destinations/ctv_web/platforms/desktop/channelaffiliates?$include=[code] and import the code into the capiConfig.js file accordingly.
        }
    }
];

module.exports = report;