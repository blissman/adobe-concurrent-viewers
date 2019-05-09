window.MarketingCloud = {
    wsse: window.wsse(),
    makeRequest: (userConfig, reportConfig, method, params) => {

        const username = userConfig.name;
        const secret = userConfig.sharedSecret;
        const endpoint = reportConfig.endpoint;

        const url = "https://" + endpoint + "/admin/1.4/rest/?method=" + method + "&" + jQuery.param(params);
        const headers = window.MarketingCloud.wsse.generateAuth(username, secret);

        // Create the XHR request
        const request = new window.XMLHttpRequest();

        // Return it as a Promise
        return new Promise((resolve, reject) =>{

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
            request.send();

        });
    }
};