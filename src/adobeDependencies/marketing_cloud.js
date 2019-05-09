window.MarketingCloud = {
    wsse: window.wsse(),
    makeRequest: (userConfig, reportConfig, method, params) => {

        const username = userConfig.name;
        const secret = userConfig.sharedSecret;
        const endpoint = reportConfig.endpoint;
        const url = "https://" + endpoint + "/admin/1.4/rest/?method=" + method + "&" + jQuery.param(params);
        const headers = window.MarketingCloud.wsse.generateAuth(username, secret);

        const request = new window.XMLHttpRequest();

        return new Promise((resolve, reject) =>{

            request.onreadystatechange = () => {

                if (request.readyState !== 4) {
                    return;
                }

                if (request.status >= 200 && request.status < 300) {
                    resolve(request);
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText,
                        request: request,
                        response: request.response
                    });
                }

            };

            request.open("POST", url, true);
            request.setRequestHeader("X-WSSE", headers["X-WSSE"]);
            request.send();
        });
    }
};