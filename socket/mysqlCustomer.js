var mysql = require('mysql');
var uuid = require('node-uuid');

var queue = require("../queue/queue");
var pool = mysql.createPool({
    host: "192.168.1.95",
    user: "foo",
    password: "bar",
    database: "database1"
});

function getStuffHistory(roomName, eventName) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        var sql = mysql.format("select source,target,roomName,eventName,context from stuffHistory where roomName=? and eventName=?", [roomName, eventName]);
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                return {err: "history db error!"};
            } else {
                return rows;
            }
        });

        connection.release();
    });
}

var mysqlCustomer = function (stuff, source, target) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        var sql = mysql.format("insert into stuffHistory (id,source,target,roomName,eventName,context) values (?,?,?,?,?,?)", [uuid.v1(), source, target, stuff.roomName, stuff.eventName, stuff.context]);
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
    queue.registerEvent(queue.stuff, mysqlCustomer);
}

module.exports.register = register;
module.exports.getStuffHistory = getStuffHistory;
module.exports.pool = pool;