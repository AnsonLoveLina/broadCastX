function getParams(url) {
    if (url.indexOf("?") != -1) {
        url = url.split("?")[1];
    }
    var params = {};
    for (var i = 0; i < url.split("&").length; i++) {
        var param = url.split("&")[i];
        if (param.indexOf("=") != -1) {
            params[param.split("=")[0]] = param.split("=")[1];
        }
    }
    return params;
}

function parseJson(data, err) {
    if ("string" == typeof data) {
        // console.log(data);
        try {
            data = JSON.parse(data);
        } catch (e) {
            err(e);
        }
    }
    return data;
}

module.exports.getParams = getParams;
module.exports.parseJson = parseJson;