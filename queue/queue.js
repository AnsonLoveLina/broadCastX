var eventMap = new Map();

var stuff = "stuff";

function registerEvent(eventName, customer) {
    var customers = [];
    if (!!eventMap.get(eventName)) {
        customers = eventMap.get(eventName);
    }
    customers.push(customer);
    eventMap.set(eventName, customers);
}

function sendQueueMsgEvent(eventName, stuff, source, target) {
    var customers = eventMap.get(eventName);
    for (var customer in customers) {
        customer(stuff, source, target);
    }
}

module.exports.stuff = stuff;
module.exports.registerEvent = registerEvent;
module.exports.sendQueueMsgEvent = sendQueueMsgEvent;
