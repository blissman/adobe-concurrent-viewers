const parseData = require("../src/parseData.js");

describe("parseData methods", () => {

    const testSchedule = [{
            showName: 'SC With Jay and Dan - SC With Jay and Dan',
            showDescription: "The latest scores and highlights, with hosts Jay Onrait and Dan O'Toole.",
            startTime: 1554091200,
            endTime: 1554094800
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554094800,
            endTime: 1554098400
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554098400,
            endTime: 1554102000
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554102000,
            endTime: 1554103800
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554103800,
            endTime: 1554107400
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554107400,
            endTime: 1554111000
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554111000,
            endTime: 1554114600
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554114600,
            endTime: 1554118200
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554118200,
            endTime: 1554121800
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554121800,
            endTime: 1554125400
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554125400,
            endTime: 1554129000
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554129000,
            endTime: 1554132600
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554132600,
            endTime: 1554136200
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554136200,
            endTime: 1554138000
        },
        {
            showName: 'Harlem Globetrotters Training Camp - Harlem Globetrotters Training Camp',
            showDescription: 'Training camp with the Harlem Globetrotters.',
            startTime: 1554138000,
            endTime: 1554139800
        },
        {
            showName: 'NFL Live - NFL Live',
            showDescription: 'Analysts break down the latest news in the NFL, ' +
                'offering views on players, coaches and ' +
                'management.',
            startTime: 1554139800,
            endTime: 1554145200
        },
        {
            showName: 'Top 10 NFL Characters - Top 10 NFL Characters',
            showDescription: 'Featuring some of the most unique individuals from the NFL.',
            startTime: 1554145200,
            endTime: 1554147000
        },
        {
            showName: 'Outside the Lines - Outside the Lines',
            showDescription: 'Examining daily issues with an investigative ' +
                'piece followed by a debate. Hosted by Bob Ley.',
            startTime: 1554147000,
            endTime: 1554148800
        },
        {
            showName: "2019 World Men's Curling Championship - Canada vs. Norway",
            showDescription: 'From ENMAX Centre in Lethbridge, Alberta.',
            startTime: 1554148800,
            endTime: 1554159600
        },
        {
            showName: "2019 NCAA Women's Basketball Tournament - Iowa vs. Baylor",
            showDescription: 'The No. 1 Bears and No. 2 Hawkeyes battle in the ' +
                'Elite Eight with a Final Four spot on the line.',
            startTime: 1554159600,
            endTime: 1554166800
        },
        {
            showName: "2019 NCAA Women's Basketball Tournament - Stanford vs. Notre Dame",
            showDescription: 'No. 1 Notre Dame and No. 2 Stanford meet for the ' +
                'fourth time in the last five NCAA tournaments.',
            startTime: 1554166800,
            endTime: 1554174000
        },
        {
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.',
            startTime: 1554174000,
            endTime: 1554177600
        }
    ];

    const adobeDataArray = [
            {
            "report": {
                "type": "ranked",
                "elements": [{
                    "id": "videoconcurrentviewers",
                    "name": "Video Concurrent Viewers"
                }],
                "reportSuite": {
                    "id": "bellmediatsnprod",
                    "name": "TSN - Prod"
                },
                "period": "Thu.  2 May 2019 - Fri.  3 May 2019",
                "metrics": [{
                    "id": "instances",
                    "name": "Instances",
                    "type": "number",
                    "decimals": 0,
                    "latency": 2602,
                    "current": false
                }],
                "segments": [{
                    "id": "s300008103_5cccaa0d85d04262783da2e6",
                    "name": "TSN Live Streams"
                }],
                "data": [{
                    "name": "00:24 2019-05-02",
                    "url": "",
                    "counts": ["237"]
                }, {
                    "name": "00:26 2019-05-02",
                    "url": "",
                    "counts": ["235"]
                }, {
                    "name": "00:25 2019-05-02",
                    "url": "",
                    "counts": ["236"]
                }, {
                    "name": "00:23 2019-05-02",
                    "url": "",
                    "counts": ["236"]
                }],
                "totals": ["321749"],
                "version": "1.4.18.10"
            },
            "waitSeconds": 0,
            "runSeconds": 0
        },
        {
            "report": {
                "type": "ranked",
                "elements": [{
                    "id": "videoconcurrentviewers",
                    "name": "Video Concurrent Viewers"
                }],
                "reportSuite": {
                    "id": "bellmediatsnprod",
                    "name": "TSN - Prod"
                },
                "period": "Fri.  3 May 2019 - Sat.  4 May 2019",
                "metrics": [{
                    "id": "instances",
                    "name": "Instances",
                    "type": "number",
                    "decimals": 0,
                    "latency": 2602,
                    "current": false
                }],
                "segments": [{
                    "id": "s300008103_5cccaa0d85d04262783da2e6",
                    "name": "TSN Live Streams"
                }],
                "data": [{
                    "name": "00:24 2019-05-03",
                    "url": "",
                    "counts": ["237"]
                }, {
                    "name": "00:26 2019-05-03",
                    "url": "",
                    "counts": ["235"]
                }, {
                    "name": "00:25 2019-05-03",
                    "url": "",
                    "counts": ["236"]
                }, {
                    "name": "00:23 2019-05-03",
                    "url": "",
                    "counts": ["236"]
                }],
                "totals": ["321749"],
                "version": "1.4.18.10"
            },
            "waitSeconds": 0,
            "runSeconds": 0
        }
    ];

    const capiScheduleArray = [
        [
            {
                showName: 'SC With Jay and Dan - SC With Jay and Dan',
                showDescription: "The latest scores and highlights, with hosts Jay Onrait and Dan O'Toole.",
                startTime: 1554091200,
                endTime: 1554094800
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554094800,
                endTime: 1554098400
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554098400,
                endTime: 1554102000
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554102000,
                endTime: 1554103800
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554103800,
                endTime: 1554107400
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554107400,
                endTime: 1554111000
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554111000,
                endTime: 1554114600
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554114600,
                endTime: 1554118200
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554118200,
                endTime: 1554121800
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554121800,
                endTime: 1554125400
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554125400,
                endTime: 1554129000
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554129000,
                endTime: 1554132600
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554132600,
                endTime: 1554136200
            }
        ],
        [
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554136200,
                endTime: 1554138000
            },
            {
                showName: 'Harlem Globetrotters Training Camp - Harlem Globetrotters Training Camp',
                showDescription: 'Training camp with the Harlem Globetrotters.',
                startTime: 1554138000,
                endTime: 1554139800
            },
            {
                showName: 'NFL Live - NFL Live',
                showDescription: 'Analysts break down the latest news in the NFL, ' +
                    'offering views on players, coaches and ' +
                    'management.',
                startTime: 1554139800,
                endTime: 1554145200
            },
            {
                showName: 'Top 10 NFL Characters - Top 10 NFL Characters',
                showDescription: 'Featuring some of the most unique individuals from the NFL.',
                startTime: 1554145200,
                endTime: 1554147000
            },
            {
                showName: 'Outside the Lines - Outside the Lines',
                showDescription: 'Examining daily issues with an investigative ' +
                    'piece followed by a debate. Hosted by Bob Ley.',
                startTime: 1554147000,
                endTime: 1554148800
            },
            {
                showName: "2019 World Men's Curling Championship - Canada vs. Norway",
                showDescription: 'From ENMAX Centre in Lethbridge, Alberta.',
                startTime: 1554148800,
                endTime: 1554159600
            },
            {
                showName: "2019 NCAA Women's Basketball Tournament - Iowa vs. Baylor",
                showDescription: 'The No. 1 Bears and No. 2 Hawkeyes battle in the ' +
                    'Elite Eight with a Final Four spot on the line.',
                startTime: 1554159600,
                endTime: 1554166800
            },
            {
                showName: "2019 NCAA Women's Basketball Tournament - Stanford vs. Notre Dame",
                showDescription: 'No. 1 Notre Dame and No. 2 Stanford meet for the ' +
                    'fourth time in the last five NCAA tournaments.',
                startTime: 1554166800,
                endTime: 1554174000
            },
            {
                showName: 'SportsCentre - SportsCentre',
                showDescription: 'News, highlights, analysis and interviews from the world of sports.',
                startTime: 1554174000,
                endTime: 1554177600
            }
        ]
    ];

    it("should return the appropriate show for the time", () => {
        expect(parseData.getCapiShow(testSchedule, "1554174000")).toEqual({
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.'
        });
        expect(parseData.getCapiShow(testSchedule, "1554148801")).toEqual({
            showName: "2019 World Men's Curling Championship - Canada vs. Norway",
            showDescription: 'From ENMAX Centre in Lethbridge, Alberta.'
        });
        expect(parseData.getCapiShow(testSchedule, "1554174001")).toEqual({
            showName: 'SportsCentre - SportsCentre',
            showDescription: 'News, highlights, analysis and interviews from the world of sports.'
        });
        expect(parseData.getCapiShow(testSchedule, 1554177600)).toEqual(false);
    });

    it("should return false if no show exists in that timeslot", () => {
        expect(parseData.getCapiShow(testSchedule, 1554177601)).toEqual(false);
        expect(parseData.getCapiShow(testSchedule, "1154177605")).toEqual(false);
        expect(parseData.getCapiShow(testSchedule, "1554091199")).toEqual(false);
    });

    it("should return a single array with the child elements combined", () => {
        expect(parseData.getCombinedSchedule(capiScheduleArray)).toEqual(testSchedule);
    });
});