window.report = {
    rsid: "exampleRSID", // your RSID name
    segmentId: "someSegmentId", // insert your segment id here
    type: "daily", // can be daily or monthly
    month: 5, // 1-12 representing January-December: the month for monthly reports (not used for daily reporting)
    year: 2019, // the desired year for monthly reporting
    startDate: "2018-07-09", // your start date in YYYY-MM-DD format
    endDate: "2018-07-10", // your end date in YYYY-MM-DD format
    endpoint: "api.omniture.com" // Adobe's San Jose datacentre (api2.omniture.com = Dallas, api3.omniture.com = London, api4.omniture.com = Singapore)
};