const capiConfig = require("../src/capiConfig.js");

describe("capiConfig", () => {
    it("should set the correct URLs for TSN capi calls", () => {
        expect(capiConfig.getURL("TSN1", "2019-05-02", "2019-05-03")).toEqual("http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/TSN1-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("TSN2", "2019-05-02", "2019-05-03")).toEqual("http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/TSN2-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("TSN3", "2019-05-02", "2019-05-03")).toEqual("http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/TSN3-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("TSN4", "2019-05-02", "2019-05-03")).toEqual("http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/TSN4-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("TSN5", "2019-05-02", "2019-05-03")).toEqual("http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/TSN5-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("TSN6", "2019-05-02", "2019-05-03")).toEqual("http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/TSN6-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("TSN7", "2019-05-02", "2019-05-03")).toEqual("http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/TSN7-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("TSN8", "2019-05-02", "2019-05-03")).toEqual("http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/TSN8-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("TSN9", "2019-05-02", "2019-05-03")).toEqual("http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/TSN9-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
    });

    it("should set the correct URLs for Crave capi calls", () => {
        expect(capiConfig.getURL("CRAVE1", "2019-05-02", "2019-05-03")).toEqual("https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/CRV1-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("CRAVE2", "2019-05-02", "2019-05-03")).toEqual("https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/CRV2-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("CRAVE3", "2019-05-02", "2019-05-03")).toEqual("https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/CRV3-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("CRAVE4", "2019-05-02", "2019-05-03")).toEqual("https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/CRV4-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
    });

    it("should set the correct URLs for HBO capi calls", () => {
        expect(capiConfig.getURL("HBO1", "2019-05-02", "2019-05-03")).toEqual("https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/HBO1-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("HBO2", "2019-05-02", "2019-05-03")).toEqual("https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/HBO2-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
    });

    it("should set the correct URLs for STARZ capi calls", () => {
        expect(capiConfig.getURL("STARZ1", "2019-05-02", "2019-05-03")).toEqual("https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/STARZ1-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("STARZ2", "2019-05-02", "2019-05-03")).toEqual("https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/STARZ2-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
    });

    it("should set the correct URLs for CTV capi calls", () => {
        expect(capiConfig.getURL("CTV1", "2019-05-02", "2019-05-03")).toEqual("https://capi.9c9media.com/destinations/ctv_web/platforms/desktop/channelaffiliates/CFTO-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
        expect(capiConfig.getURL("CTV2", "2019-05-02", "2019-05-03")).toEqual("https://capi.9c9media.com/destinations/ctv_web/platforms/desktop/channelaffiliates/CHRO-G/schedules?StartTime=2019-05-02T00:00:00&EndTime=2019-05-03T00:00:00");
    });
});