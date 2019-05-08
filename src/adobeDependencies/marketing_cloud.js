// window.MarketingCloud = {
//     env: {},
//     wsse: window.wsse(),

//     /** Make the api request */
//     /* callback should follow standard jQuery request format:
//      *    function callback(data)
//      */
//     makeRequest: function(username, secret, method, params, endpoint, callback) {
//         var headers = window.MarketingCloud.wsse.generateAuth(username, secret);
//         var url = "https://" + endpoint + "/admin/1.4/rest/?method=" + method;
//         $.ajax(url, {
//             type: "POST",
//             data: params,
//             complete: callback,
//             dataType: "text",
//             headers: {
//                 "X-WSSE": headers["X-WSSE"]
//             }
//         });
//     }
// };


window.MarketingCloud = {
    env: {},
    wsse: window.wsse(),
    makeRequest: (username, secret, method, params, endpoint, callback) => {

        const url = "https://" + endpoint + "/admin/1.4/rest/?method=" + method;
        const headers = window.MarketingCloud.wsse.generateAuth(username, secret);

        // Create the XHR request
        const request = new window.XMLHttpRequest();

        // Return it as a Promise
        return new Promise(function(resolve, reject) {

            // Setup our listener to process compeleted requests
            request.onreadystatechange = () => {

                // Only run if the request is complete
                if (request.readyState !== 4) {
                    return;
                }

                // Process the response
                if (request.status >= 200 && request.status < 300) {
                    // If successful
                    resolve(request);
                } else {
                    // If failed
                    reject({
                        status: request.status,
                        statusText: request.statusText,
                        request: request,
                        response: request.response
                    });
                }

            };

            // Setup our HTTP request
            request.open("POST", url, true);
            // set the auth headers
            request.setRequestHeader("X-WSSE", headers["X-WSSE"]);
            // Send the request
            console.log(params);
            request.send(params);

        });
    }
};