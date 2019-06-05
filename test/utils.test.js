const utils = require("../src/utils.js");

describe("utils", () => {

    it("should return false if segments argument is not an array", () => {
        expect(utils.getSegments(1)).toBeFalsy();
        expect(utils.getSegments("butts")).toBeFalsy();
        expect(utils.getSegments({"this": false})).toBeFalsy();
        expect(utils.getSegments(true)).toBeFalsy();
    });

    it("should return the right number of days for non leap-years", () => {
        expect(utils.getDays(1, 2018)).toEqual(31);
        expect(utils.getDays(2, 2019)).toEqual(28);
        expect(utils.getDays(3, 2019)).toEqual(31);
        expect(utils.getDays(4, 2019)).toEqual(30);
        expect(utils.getDays(5, 2019)).toEqual(31);
        expect(utils.getDays(6, 2019)).toEqual(30);
        expect(utils.getDays(7, 2019)).toEqual(31);
        expect(utils.getDays(8, 2019)).toEqual(31);
        expect(utils.getDays(9, 2019)).toEqual(30);
        expect(utils.getDays(10, 2019)).toEqual(31);
        expect(utils.getDays(11, 2019)).toEqual(30);
        expect(utils.getDays(12, 2019)).toEqual(31);
    });

    it("should return false for invalid months", () => {
        expect(utils.getDays(0, 2019)).toBeFalsy();
        expect(utils.getDays(undefined, 2019)).toBeFalsy();
        expect(utils.getDays(null, 2019)).toBeFalsy();
        expect(utils.getDays(()=>{}, 2019)).toBeFalsy();
        expect(utils.getDays(13, 2019)).toBeFalsy();
        expect(utils.getDays("thirteen", 2019)).toBeFalsy();
        expect(utils.getDays(12, "2019")).toBeFalsy();
        expect(utils.getDays(11, null)).toBeFalsy();
        expect(utils.getDays(12, undefined)).toBeFalsy();
        expect(utils.getDays(11, false)).toBeFalsy();
    });

    it("should return 29 for February leap years", () => {
        expect(utils.getDays(2, 2020)).toEqual(29);
        expect(utils.getDays(2, 2024)).toEqual(29);
        expect(utils.getDays(2, 2028)).toEqual(29);
    });

    it("should return month names correctly", () => {
        expect(utils.getMonthName(null)).toBeFalsy();
        expect(utils.getMonthName()).toBeFalsy();
        expect(utils.getMonthName("6")).toBeFalsy();
        expect(utils.getMonthName(()=>{})).toBeFalsy();
        expect(utils.getMonthName(true)).toBeFalsy();
        expect(utils.getMonthName(13)).toBeFalsy();
        expect(utils.getMonthName(-1)).toBeFalsy();
        expect(utils.getMonthName(0)).toBeFalsy();
        expect(utils.getMonthName(1)).toEqual("January");
        expect(utils.getMonthName(2)).toEqual("February");
        expect(utils.getMonthName(3)).toEqual("March");
        expect(utils.getMonthName(4)).toEqual("April");
        expect(utils.getMonthName(5)).toEqual("May");
        expect(utils.getMonthName(6)).toEqual("June");
        expect(utils.getMonthName(7)).toEqual("July");
        expect(utils.getMonthName(8)).toEqual("August");
        expect(utils.getMonthName(9)).toEqual("September");
        expect(utils.getMonthName(10)).toEqual("October");
        expect(utils.getMonthName(11)).toEqual("November");
        expect(utils.getMonthName(12)).toEqual("December");
    });

    it("should be able to accept multiple segments in an array", () => {
        expect(utils.getSegments(["oneSegment"])).toEqual([{"id": "oneSegment"}]);
        expect(utils.getSegments(["oneSegment", "twoSegments"])).toEqual([{"id": "oneSegment"}, {"id": "twoSegments"}]);
    });

});