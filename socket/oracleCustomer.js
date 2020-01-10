var oracleServer = require('./oracle/oracleServer');
var uuid = require('node-uuid');

var queue = require("../queue/queue");

var imEventstuff = "im";

function setDefault(data) {
    if (data.page == undefined) {
        data.page = 1;
    }
    if (data.pageSize == undefined) {
        data.pageSize = 10;
    }
    if (data.unReceived == undefined) {
        data.unReceived = false;
    }
    if (data.unReceived instanceof String) {
        data.unReceived = eval(data.unReceived.toLowerCase());
    } else if (!data.unReceived instanceof Boolean) {
        data.unReceived = false;
    }
    return data;
}

function getSqlFormat(data) {
    var select = "select * from stuffHistory ";
    var where = " where target=:target and targetType=:targetType and eventName=:eventName ";
    if (data.unReceived) {
        where = where + " and targetCreateTime is null ";
    }
    var orderBy = " order by sourceCreateTime desc ";
    var page = "select id,source,sourceCreateTime,target,targetType,targetCreateTime,roomName,eventName,context from (select * from (select row_.*,rownum rownum_ from (" + select + where + orderBy + ") row_ where rownum <= :pageEnd) where rownum_ > :pageStart)";
    // var sql = select + where + orderBy + " limit " + data.start + "," + (data.end - data.start);
    return page;
}

function getStuffHistory(data, callBack) {
    data = setDefault(data);
    var sql = getSqlFormat(data);
    var param = {
        target: data.target,
        targetType: data.targetType,
        eventName: data.eventName,
        pageStart: (data.page - 1) * data.pageSize,
        pageEnd: data.page * data.pageSize
    };
    var promise1 = oracleServer.executeSql("broadcastx", sql, param);
    promise1.then(function (value) {
        callBack(value);
    });
}

var oracleCustomer = function (stuff) {
    if (stuff.source == undefined || stuff.target == undefined || stuff.targetType == undefined || stuff.roomName == undefined || stuff.eventName == undefined || stuff.context == undefined) {
        console.log("illegal stuff:" + stuff);
        return;
    }
    var sql = "insert into stuffHistory (id,source,sourceCreateTime,target,targetType,roomName,eventName,context) values (:0,:1,sysdate,:2,:3,:4,:5,:6)";
    var param = [uuid.v1(), stuff.source, stuff.target, stuff.targetType, stuff.roomName, stuff.eventName, stuff.context];
    oracleServer.executeSql("broadcastx", sql, param);
};

function register() {
    queue.registerEvent(imEventstuff, oracleCustomer);
}

module.exports.register = register;
module.exports.getStuffHistory = getStuffHistory;
module.exports.imEvent = imEventstuff;
