function register(data, io, socket,fn) {
    if (data.user) {
        let user = data.user;
        //广播接收者
        let roomPeoples = io.sockets.adapter.rooms[user];
        let result;
        if (roomPeoples !== undefined) {
            result = {flag:"1",messageType:"register",messageLevel:"warn",message:"login repeated!unRegister the older one!"};
            for (let loginedSocketId in roomPeoples.sockets) {
                console.log("client:" + loginedSocketId + ";" + user + " is unRegistered!");
                socket.to(loginedSocketId).leave(user);
            }
        }

        console.log("client:" + socket.id + ";" + user + " login success!");
        socket.join(user);

        socket.on("disconnect", function (reason) {
            console.log("client:" + socket.id + "connection is closed,auto unRegister the user:" + user + "!");
        });
        if (result === undefined){
            result = {flag:"1",messageType:"register",messageLevel:"info",message:user + " login success"};
        }
        return result;
    } else if (data.group) {
        let group = data.group;
        let result;
        if (group.indexOf("pairGroup") === 0) {
            let roomPeoples = io.sockets.adapter.rooms[group];
            //第二个注册的人会发送offer
            if (roomPeoples !== undefined) {
                result = {flag:"1",messageType:"register",messageLevel:"info",message:{pairOffer:true}};
            } else {
                result = {flag:"1",messageType:"register",messageLevel:"info",message:{pairOffer:false}};
            }
        }
        console.log("client:" + socket.id + " join the group:" + group + " success!");
        socket.join(group);

        socket.on("disconnect", function (reason) {
            console.log("client:" + socket.id + "connection is closed,auto unRegister the group:" + group + "!");
        });
        if (result === undefined){
            result = {flag:"1",messageType:"register",messageLevel:"info",message:"join the group:" + group + " success!"}
        }
        return result;
    }
}

module.exports.register = register;
