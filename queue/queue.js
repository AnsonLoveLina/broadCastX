var serverUtil = require('../util/serverUtil');
var eventMap = new Map();


function registerEvent(eventName, customer) {
    var customers = [];
    if (eventMap.get(eventName) != undefined) {
        customers = eventMap.get(eventName);
    }
    customers.push(customer);
    eventMap.set(eventName, customers);
}

function sendQueueMsgEvent(eventName, stuff) {
    stuff = serverUtil.parseJson(stuff, function (err) {
        console.log(err + " \n json " + stuff + " parse error!");
    });
    var customers = eventMap.get(eventName);
    for (var index in customers) {
        customers[index](stuff);
    }
}

module.exports.registerEvent = registerEvent;
module.exports.sendQueueMsgEvent = sendQueueMsgEvent;
