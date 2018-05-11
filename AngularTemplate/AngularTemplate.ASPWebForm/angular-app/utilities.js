'use strict';
'use strict';
(function () {
    window.utilities = {
        url: {
            getUrlOrigin: function (url) {
                var tempUrl = url;
                var origin = "";
                if (url.indexOf("//")) {
                    origin += url.split("//")[0] + "//";
                    origin += url.split("//")[1].split("/")[0];
                }
                else {
                    origin += url.split("/")[0];
                }
                return origin;
            },

            addParameter: function (url, parameterName, parameterValue) {
                if (parameterName && parameterValue) {
                    if (url.indexOf("?") < 0) {
                        url += "?";
                    }
                    else {
                        url += "&";
                    }
                    url += parameterName + "=" + parameterValue;
                }
                return url;
            },

            validateLink: function (linkInput) {
                if (!constants.regexs.link.test(linkInput.toLowerCase()) && !constants.regexs.httpLink.test(linkInput.toLowerCase())) {
                    return false;
                }
                else {
                    return true;
                }
            },

            andQuery: function (a, b) {
                if (a && a.trim()) {
                    if (b && b.trim()) {

                        return groupAndOrQuery(a) + " and " + groupAndOrQuery(b);
                    }
                    else {
                        return a;
                    }
                }
                else {
                    return b;
                }
            },

            orQuery: function (a, b) {
                if (a && a.trim()) {
                    if (b && b.trim()) {
                        return groupAndOrQuery(a) + " or " + groupAndOrQuery(b);
                    }
                    else {
                        return a;
                    }
                }
                else {
                    return b;
                }
            },
        },

        dateTime: {
            //DateTime utility functions
            format: function (value, format) {
                return moment(value).format(format);
            },

            fromNow: function (input) {
                return moment(input).fromNow();
            }
        },

        validateEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    }



    function groupAndOrQuery(query) {
        if (query.indexOf(" and ") != -1 || query.indexOf(" or ") != -1) {
            return "(" + query + ")";
        }
        return query;
    }
})();