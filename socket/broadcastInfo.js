let queue = require("../queue/queue");

let mysqlCustomer = require("../socket/mysqlCustomer");

function broadcastInfo(data, io, socket) {
    if (data.roomName && data.eventName && data.text) {
        console.log("client:" + socket.id+",namespace:" + data.namespace + ",roomName:" + data.roomName + ",eventName:" + data.eventName + ",text:" + data.text);
        let roomPeoples = io.sockets.adapter.rooms[data.roomName];
        if (!roomPeoples) {
            return {
                flag: "0",
                messageType: "broadcastInfo",
                messageLevel: "info",
                message: "roomName:" + data.roomName + "not exists!"
            };
        }
        if (data.namespace) {
            emitStuff(io.of(data.namespace), data.roomName, data.eventName, data.text);
        } else {
            emitStuff(socket, data.roomName, data.eventName, data.text);
        }
        return {flag: "1", messageType: "broadcastInfo", messageLevel: "info", message: "success!"};
    } else {
        return {
            flag: "0",
            messageType: "broadcastInfo",
            messageLevel: "err",
            message: "data fromat error!{roomName,eventName,text,?namespace}"
        };
    }
}

function emitStuff(socket, roomName, eventName, data) {
    queue.sendQueueMsgEvent(mysqlCustomer.imEvent, data);
    let emit = setInterval(function () {
        console.log("roomName:"+roomName+",send:"+data);
        socket.to(roomName).volatile.emit(eventName, data);
    }, 100);

    socket.on('disconnect', function () {
        clearInterval(emit);
    });
}

module.exports.broadcastInfo = broadcastInfo;
module.exports.emitStuff = emitStuff;
