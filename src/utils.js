utils = {
    getDays: (month, year) => {
        if (!month || !year || typeof(month) !== "number" || typeof(year) !== "number" || month < 1 || month > 12) {
            console.log("Error: month or year is invalid!");
            return false;
        }
        const yearArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (year % 4 === 0) {
            yearArray[1] = 29;
        }

        return yearArray[month - 1];
    },
    getMonthName: (month) => {
        if (!month || typeof(month) !== "number" || month < 1 || month > 12) {
            console.log("Error: month or year is invalid!");
            return false;
        }
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return months[month - 1];
    },
    getSegments: (segments) => {
        if (!segments || !Array.isArray(segments)) {
            console.log(typeof(segments));
            return false;
        }
        const segmentsList = [];
        segments.forEach((element) => {
            segmentsList.push({
                "id": element
            });
        });

        return segmentsList;
    }
};

module.exports = utils;