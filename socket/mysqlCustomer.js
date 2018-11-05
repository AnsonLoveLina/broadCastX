var mysql = require('mysql');
var uuid = require('node-uuid');

var queue = require("../queue/queue");
var pool = mysql.createPool({
    host: "192.168.1.95",
    user: "foo",
    password: "bar",
    database: "database1"
});

function setDefault(data){
    if (data.start == undefined){
        data.start = 0;
    }
    if (data.end == undefined){
        data.end = 10;
    }
    return data;
}

function getSqlFormat(){
    var sql = "select id,source,sourceCreateTime,target,targetType,targetCreateTime,roomName,eventName,context from stuffHistory ";
    var where = " where roomName=? and eventName=? ";
    var orderBy = " order by sourceCreateTime ";

}

function getStuffHistory(data, callBack) {
    data = setDefault(data);
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        var sql = mysql.format("select id,source,sourceCreateTime,target,targetType,targetCreateTime,roomName,eventName,context from stuffHistory where roomName=? and eventName=? order by sourceCreateTime", [data.roomName, data.eventName]);
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
    queue.registerEvent(queue.imEvent, mysqlCustomer);
}

module.exports.register = register;
module.exports.getStuffHistory = getStuffHistory;
module.exports.pool = pool;