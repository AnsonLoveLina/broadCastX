var express = require('express');
var router = express.Router();
var broadcast = require('../socket/broadcast');
var io = broadcast.io;
var serverUtil = require('../util/serverUtil');

/* get users listing. */
router.get('/send', function (req, res, next) {
    var data = req.query;
    var roomPeoples = io.sockets.adapter.rooms[data.roomName];
    if (roomPeoples == undefined) {
        res.json({resCode: 1, err: "roomName:" + data.roomName + "not exists!"});
        return;
    }
    broadcast.emitStuff(io, data.roomName, data.eventName, data.context);
    res.json({resCode: 0});
});

/* post users listing. */
router.post('/send', function (req, res, next) {
    var data = req.body;
    data = serverUtil.parseJson(data, function (err) {
        res.json({resCode: 1, err: data + " \n json parse error!" + err});
    });
    var roomPeoples = io.sockets.adapter.rooms[data.roomName];
    if (roomPeoples == undefined) {
        res.json({resCode: 1, err: "roomName:" + data.roomName + "not exists!"});
        return;
    }
    broadcast.emitStuff(io, data.roomName, data.eventName, data.context);
    res.json({resCode: 0});
});

module.exports = router;
