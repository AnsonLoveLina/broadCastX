let io = require('socket.io')();
let serverUtil = require('../util/serverUtil');

let broadcastInfo = require("./broadcastInfo");
let register = require("./register");
let unRegister = require("./unRegister");


function initSocket(server) {

    /*socket.io*/
    let pingInterval = process.env.pingInterval || '10000';
    let pingTimeout = process.env.pingTimeout || '5000';

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
        socket.on("register", function (data,fn) {
            data = serverUtil.parseJson(data, function (err) {
                fn({flag:"0",messageType:"register",messageLevel:"err",message:err + " \n json parse error!" + data});
            });
            if (serverUtil.isObj(data)){
                let result = register.register(data, io, socket,fn);
                fn(result);
            }
        });
        socket.on("unRegister", function (data,fn) {
            data = serverUtil.parseJson(data, function (err) {
                fn({flag:"0",messageType:"unRegister",messageLevel:"err",message:err + " \n json parse error!" + data});
            });
            if (serverUtil.isObj(data)){
                let result = unRegister.unRegister(data, io, socket,fn);
                fn(result);
            }
        });

        //广播发送者
        socket.on("broadcastInfo", function (data,fn) {
            data = serverUtil.parseJson(data, function (err) {
                fn({flag:"0",messageType:"broadcastInfo",messageLevel:"err",message:err + " \n json parse error!" + data});
            });
            if (serverUtil.isObj(data)){
                let result = broadcastInfo.broadcastInfo(data, io, socket,fn);
                fn(result);
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

module.exports.initSocket = initSocket;
module.exports.io = io;
