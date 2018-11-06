var mysql = require('mysql');
var uuid = require('node-uuid');

var queue = require("../queue/queue");
var pool = mysql.createPool({
    host: "192.168.1.95",
    user: "foo",
    password: "bar",
    database: "database1"
});

var imEventstuff = "im";

function setDefault(data) {
    if (data.start == undefined) {
        data.start = 0;
    }
    if (data.end == undefined) {
        data.end = 10;
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
    var param = [data.target,data.targetType, data.eventName];
    var select = "select id,source,sourceCreateTime,target,targetType,targetCreateTime,roomName,eventName,context from stuffHistory ";
    var where = " where target=? and targetType=? and eventName=? ";
    if (data.unReceived) {
        where = where + " and targetCreateTime is null ";
    }
    var orderBy = " order by sourceCreateTime desc ";
    var sql = mysql.format(select + where + orderBy + " limit " + data.start + "," + (data.end - data.start), param);
    return sql;
}

function getStuffHistory(data, callBack) {
    data = setDefault(data);
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        var sql = getSqlFormat(data);
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                callBack({err: "history db error!"});
            } else {
                callBack(rows);
            }
        });
        connection.release();
    });
}

var mysqlCustomer = function (stuff) {
    if (stuff.source == undefined || stuff.target == undefined || stuff.targetType == undefined || stuff.roomName == undefined || stuff.eventName == undefined || stuff.context == undefined) {
        console.log("illegal stuff:" + stuff);
        return;
    }
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        var sql = mysql.format("insert into stuffHistory (id,source,sourceCreateTime,target,targetType,roomName,eventName,context) values (?,?,NOW(),?,?,?,?,?)", [uuid.v1(), stuff.source, stuff.target, stuff.targetType, stuff.roomName, stuff.eventName, stuff.context]);
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                console.log(rows);
            }
        });

        connection.release();
    });
};

function register() {
    queue.registerEvent(imEventstuff, mysqlCustomer);
}

module.exports.register = register;
module.exports.getStuffHistory = getStuffHistory;
module.exports.pool = pool;
module.exports.imEvent = imEventstuff;