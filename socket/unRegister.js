function unRegister(data, io, socket) {
    if (data.user) {
        let user = data.user;
        console.log("client:" + socket.id+",unRegister the user" + user + "!");
        socket.leave(user);
    } else if (data.group) {
        let group = data.group;
        console.log("client:" + socket.id+",unRegister the group:" + group + "!");
        socket.leave(group);
    }
    return {flag:"1",messageType:"unRegister",messageLevel:"info",message:"unRegister success!"};
}

module.exports.unRegister = unRegister;
