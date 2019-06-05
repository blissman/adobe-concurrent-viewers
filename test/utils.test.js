require("../src/utils.js");

describe("utils", () => {

    it("should return false if segments argument is not an array", () => {
        expect(window.utils.getSegments(1)).toBeFalsy();
        expect(window.utils.getSegments("butts")).toBeFalsy();
        expect(window.utils.getSegments({"this": false})).toBeFalsy();
        expect(window.utils.getSegments(true)).toBeFalsy();
    });

    it("should return the right number of days for non leap-years", () => {
        expect(window.utils.getDays(1, 2018)).toEqual(31);
        expect(window.utils.getDays(2, 2019)).toEqual(28);
        expect(window.utils.getDays(3, 2019)).toEqual(31);
        expect(window.utils.getDays(4, 2019)).toEqual(30);
        expect(window.utils.getDays(5, 2019)).toEqual(31);
        expect(window.utils.getDays(6, 2019)).toEqual(30);
        expect(window.utils.getDays(7, 2019)).toEqual(31);
        expect(window.utils.getDays(8, 2019)).toEqual(31);
        expect(window.utils.getDays(9, 2019)).toEqual(30);
        expect(window.utils.getDays(10, 2019)).toEqual(31);
        expect(window.utils.getDays(11, 2019)).toEqual(30);
        expect(window.utils.getDays(12, 2019)).toEqual(31);
    });

    it("should return false for invalid months", () => {
        expect(window.utils.getDays(0, 2019)).toBeFalsy();
        expect(window.utils.getDays(undefined, 2019)).toBeFalsy();
        expect(window.utils.getDays(null, 2019)).toBeFalsy();
        expect(window.utils.getDays(()=>{}, 2019)).toBeFalsy();
        expect(window.utils.getDays(13, 2019)).toBeFalsy();
        expect(window.utils.getDays("thirteen", 2019)).toBeFalsy();
        expect(window.utils.getDays(12, "2019")).toBeFalsy();
        expect(window.utils.getDays(11, null)).toBeFalsy();
        expect(window.utils.getDays(12, undefined)).toBeFalsy();
        expect(window.utils.getDays(11, false)).toBeFalsy();
    });

    it("should return 29 for February leap years", () => {
        expect(window.utils.getDays(2, 2020)).toEqual(29);
        expect(window.utils.getDays(2, 2024)).toEqual(29);
        expect(window.utils.getDays(2, 2028)).toEqual(29);
    });

    it("should return month names correctly", () => {
        expect(window.utils.getMonthName(null)).toBeFalsy();
        expect(window.utils.getMonthName()).toBeFalsy();
        expect(window.utils.getMonthName("6")).toBeFalsy();
        expect(window.utils.getMonthName(()=>{})).toBeFalsy();
        expect(window.utils.getMonthName(true)).toBeFalsy();
        expect(window.utils.getMonthName(13)).toBeFalsy();
        expect(window.utils.getMonthName(-1)).toBeFalsy();
        expect(window.utils.getMonthName(0)).toBeFalsy();
        expect(window.utils.getMonthName(1)).toEqual("January");
        expect(window.utils.getMonthName(2)).toEqual("February");
        expect(window.utils.getMonthName(3)).toEqual("March");
        expect(window.utils.getMonthName(4)).toEqual("April");
        expect(window.utils.getMonthName(5)).toEqual("May");
        expect(window.utils.getMonthName(6)).toEqual("June");
        expect(window.utils.getMonthName(7)).toEqual("July");
        expect(window.utils.getMonthName(8)).toEqual("August");
        expect(window.utils.getMonthName(9)).toEqual("September");
        expect(window.utils.getMonthName(10)).toEqual("October");
        expect(window.utils.getMonthName(11)).toEqual("November");
        expect(window.utils.getMonthName(12)).toEqual("December");
    });

    it("should be able to accept multiple segments in an array", () => {
        expect(window.utils.getSegments(["oneSegment"])).toEqual([{"id": "oneSegment"}]);
        expect(window.utils.getSegments(["oneSegment", "twoSegments"])).toEqual([{"id": "oneSegment"}, {"id": "twoSegments"}]);
    });

});