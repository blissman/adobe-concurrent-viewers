const utils = {
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
    },
    makeRequest: (url, method) => {
        const request = new window.XMLHttpRequest();

        return new Promise((resolve, reject) => {
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status >= 200 && request.status < 300) {
                    resolve(request);
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
            request.open(method || "GET", url, true);
            request.send();
        });
    },
    formatMonth: (month) => {
        if (typeof(month) !== "number" || month < 1 || month > 12) {
            return false;
        }

        if (month.toString().length === 1) {
            return "0" + month.toString();
        } else {
            return month.toString();
        }
    },
    formatDate: (date) => {
        if (typeof(date) !== "number" || date < 1 || date > 31) {
            return false;
        }

        if (date.toString().length === 1) {
            return "0" + date.toString();
        } else {
            return date.toString();
        }
    }
};

module.exports = utils;