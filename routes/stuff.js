var express = require('express');
var router = express.Router();
var broadcast = require('../socket/broadcast');
var io = broadcast.io;
var serverUtil = require('../util/serverUtil');

var queue = require("../queue/queue");

var mysqlCustomer = require("../socket/mysqlCustomer");

/* post users listing. */
router.get('/stuffHistory', function (req, res, next) {
    var data = req.query;
    if (!!data.roomName || !!data.eventName){
        res.send({resCode: 1, err: "roomName and eventName is null!"});
    }
    var result = mysqlCustomer.getStuffHistory(data.roomName,data.eventName);
    if (result.err){
        res.send({resCode: 1,err:result.err});
    } else {
        res.send({resCode: 0,result:result});
    }
});

/* GET users listing. */
router.get('/send', function (req, res, next) {
    var data = req.query;
    queue.sendQueueMsgEvent(queue.stuff, data);
    var roomPeoples = io.sockets.adapter.rooms[data.roomName];
    if (!!roomPeoples) {
        res.send({resCode: 1, err: "roomName:" + data.roomName + "not exists!"});
        return;
    }
    io.to(data.roomName).emit(data.eventName, data.context);
    res.send({resCode: 0});
});

/* post users listing. */
router.post('/send', function (req, res, next) {
    var data = req.body;
    data = serverUtil.parseJson(data, function (err) {
        res.send({resCode: 1, err: data + " \n json parse error!" + err});
    });
    queue.sendQueueMsgEvent(queue.stuff, data);
    var roomPeoples = io.sockets.adapter.rooms[data.roomName];
    if (!!roomPeoples) {
        res.send({resCode: 1, err: "roomName:" + data.roomName + "not exists!"});
        return;
    }
    io.to(data.roomName).emit(data.eventName, data.context);
    res.send({resCode: 0});
});

module.exports = router;
