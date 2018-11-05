var io = require('socket.io')();
var serverUtil = require('../util/serverUtil');

var queue = require("../queue/queue");

function register(data, io, socket) {
    if (data.user) {
        var user = data.user;
        //广播接收者
        var roomPeoples = io.sockets.adapter.rooms[user];
        if (roomPeoples != undefined) {
            socket.emit("warn", "login repeated!unRegister the older one!");
            for (var loginedSocketId in roomPeoples.sockets) {
                console.log("client:" + loginedSocketId + ";" + user + " is unRegistered!");
                socket.to(loginedSocketId).leave(user);
            }
        }

        console.log("client:" + socket.id + ";" + user + " login success!");
        socket.emit("info", user + " login success");
        socket.join(user);

        socket.on("disconnect", function (reason) {
            console.log("client:" + socket.id + "connection is closed,auto unRegister the user:" + user + "!");
            // socket.to(socket.id).leave(user);
            // socket.leave(user);
        });
    } else if (data.group) {
        var group = data.group;
        if (group.indexOf("pairGroup") == 0) {
            var roomPeoples = io.sockets.adapter.rooms[group];
            //第二个注册的人会发送offer
            if (roomPeoples != undefined) {
                socket.emit("pairOffer", true);
            } else {
                socket.emit("pairOffer", false);
            }
        }
        console.log("client:" + socket.id + " join the group:" + group + " success!");
        socket.emit("info", "join the group:" + group + " success!");
        socket.join(group);

        socket.on("disconnect", function (reason) {
            console.log("client:" + socket.id + "connection is closed,auto unRegister the group:" + group + "!");
            // socket.to(socket.id).leave(group);
            // socket.leave(group);
        });
    }
}

function unRegister(data, io, socket) {
    if (data.user) {
        var user = data.user;
        console.log("unRegister the user" + user + "!");
        socket.leave(user);
    } else if (data.group) {
        var group = data.group;
        console.log("unRegister the group:" + group + "!");
        socket.leave(group);
    }
}

function initSocket(server) {

    /*socket.io*/
    var pingInterval = process.env.pingInterval || '10000';
    var pingTimeout = process.env.pingTimeout || '5000';

    io.attach(server, {
        //间隔时间ping客户端
        pingInterval: pingInterval,
        //假如客户端ping超时则关闭链接
        pingTimeout: pingTimeout,
        cookie: false
    });

    initConnection(io);
}

function initConnection(io) {
    return io.on('connection', function (socket) {
        console.log('connection:' + socket.id);
        socket.on("register", function (data) {
            data = serverUtil.parseJson(data, function (err) {
                socket.emit("err", err + " \n json parse error!" + data);
            });
            register(data, io, socket);
        });
        socket.on("unRegister", function (data) {
            data = serverUtil.parseJson(data, function (err) {
                socket.emit("err", err + " \n json parse error!" + data);
            });
            unRegister(data, io, socket);
        });

        //广播发送者
        socket.on("broadcastInfo", function (data) {
            data = serverUtil.parseJson(data, function (err) {
                socket.emit("err", err + " \n json parse error!" + data);
            });
            if (data.roomName && data.eventName && data.text) {
                console.log("socket:" + socket.id);
                console.log("namespace:" + data.namespace + ",roomName:" + data.roomName + ",eventName:" + data.eventName + ",text:" + data.text);
                var roomPeoples = io.sockets.adapter.rooms[data.roomName];
                if (!roomPeoples) {
                    socket.emit("info", "roomName:" + data.roomName + "not exists!");
                    return;
                }
                if (data.namespace) {
                    emitStuff(io.of(data.namespace),data.roomName,data.eventName,data.text);
                } else {
                    emitStuff(socket,data.roomName,data.eventName,data.text);
                }
            } else {
                socket.emit("err", "data fromat error!{roomName,eventName,text,?namespace}");
            }
        });

        socket.on("reconnect", function (data) {
            console.log("reconnect:" + data);
        });

        socket.on("error", function (error) {
            console.log(error);
        });
    });
}

function emitStuff(socket,roomName,eventName,data){
    queue.sendQueueMsgEvent(queue.imEvent, data);
    socket.to(roomName).emit(eventName, data);
}

module.exports.initSocket = initSocket;
module.exports.emitStuff = emitStuff;
module.exports.io = io;