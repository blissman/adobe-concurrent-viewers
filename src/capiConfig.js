const capiConfig = {
    getURL: (channel, startDate, endDate) => {
        const TSNtest = new RegExp(/^TSN[1-9]$/g);
        const RDStest = new RegExp(/^RDS/g);
        const CTV1test = new RegExp(/^CTV1$/g);
        const CTV2test = new RegExp(/^CTV2$/g);
        const Cravetest = new RegExp(/^CRAVE/g);
        const HBOtest = new RegExp(/^HBO[1-2]$/g);
        const STARZtest = new RegExp(/^STARZ[1-2]$/g);

        if (TSNtest.test(channel)) {
            return "http://capi.9c9media.com/destinations/tsn_web/platforms/desktop/channelaffiliates/" + channel + "-G/schedules?StartTime=" + startDate + "T00:00:00&EndTime=" + endDate + "T00:00:00";
        }

        if (RDStest.test(channel)) {
            return "http://capi.9c9media.com/destinations/rds_web/platforms/desktop/channelaffiliates/" + channel + "HD-G/schedules?StartTime=" + startDate + "T00:00:00&EndTime=" + endDate + "T00:00:00";
        }

        if (CTV1test.test(channel)) {
            return "https://capi.9c9media.com/destinations/ctv_web/platforms/desktop/channelaffiliates/CFTO-G/schedules?StartTime=" + startDate + "T00:00:00&EndTime=" + endDate + "T00:00:00";
        }

        if (CTV2test.test(channel)) {
            return "https://capi.9c9media.com/destinations/ctv_web/platforms/desktop/channelaffiliates/CHRO-G/schedules?StartTime=" + startDate + "T00:00:00&EndTime=" + endDate + "T00:00:00";
        }

        if (Cravetest.test(channel)) {
            const numberTest = new RegExp(/[0-9]/g);
            const number = channel.match(numberTest)[0];
            return "https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/CRV" + number + "-G/schedules?StartTime=" + startDate + "T00:00:00&EndTime=" + endDate + "T00:00:00";
        }

        if (HBOtest.test(channel)) {
            return "https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/" + channel + "-G/schedules?StartTime=" + startDate + "T00:00:00&EndTime=" + endDate + "T00:00:00";
        }

        if (STARZtest.test(channel)) {
            return "https://capi.9c9media.com/destinations/craveplus_atexace/platforms/atexace/channelaffiliates/" + channel + "-G/schedules?StartTime=" + startDate + "T00:00:00&EndTime=" + endDate + "T00:00:00";
        }

        console.warn("Invalid Capi Channel!");
        return "Invalid Capi Channel!";
    }
};

module.exports = capiConfig;