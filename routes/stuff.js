var express = require('express');
var router = express.Router();

var mysqlCustomer = require("../socket/mysqlCustomer");

/* get users listing. */
router.get('/stuffHistory', function (req, res, next) {
    var data = req.query;
    if (data.roomName == undefined || data.eventName == undefined) {
        res.json({resCode: 1, err: "roomName and eventName is null!"});
        return;
    }
    mysqlCustomer.getStuffHistory(data, function (result) {
        if (result.err != undefined) {
            res.json({resCode: 1, err: result.err});
        } else {
            res.json({resCode: 0, result: result});
        }
    });
});

module.exports = router;