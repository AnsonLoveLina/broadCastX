var express = require('express');
var router = express.Router();

var oracleCustomer = require("../socket/oracleCustomer");

/* get users listing. */
router.get('/stuffHistory', function (req, res) {
    var data = req.query;
    if (data.targetType == undefined || data.target == undefined || data.eventName == undefined) {
        res.json({resCode: 1, err: "one of target,targetType and eventName is null!"});
        return;
    }
    oracleCustomer.getStuffHistory(data, function (result) {
        if (result.err != undefined) {
            res.json({resCode: 1, err: result.err});
        } else {
            res.json({resCode: 0, result: result});
        }
    });
});

module.exports = router;