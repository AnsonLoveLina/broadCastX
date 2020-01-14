var oracledb = require("oracledb");
var fs = require("fs");
var readline = require("readline");

oracledb.poolMax = 100;
oracledb.poolMin = 1;
oracledb.poolPingInterval = 20;
oracledb.poolTimeout = 0;
oracledb.fetchAsBuffer = [oracledb.BLOB];
oracledb.fetchAsString = [oracledb.CLOB];
oracledb.autoCommit = true;

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);

// readFile 读取文件函数，返回promise
var readFile = async function (path) {
    var rl = readline.createInterface({
        input: fs.createReadStream(path).setEncoding('utf8')
    });
    return new Promise((resolve, reject) => {
        var array = [];
        rl.on("line", line => {
            array.push(line);
        });
        rl.on("close", () => {
            resolve(array);
        });
    });
};

// 初始化连接池
var pool = {};

var initPool = async function () {
    // var dbconfig = await readFile('./oracleDatasource.ini');
    // for (var i = 0; i < dbconfig.length; i++) {
    //     var temp = dbconfig[i].split(',');
    try {
        await oracledb.createPool({
            _enableStats: true,
            user: process.env.oracleUser,
            password: process.env.oraclePassword,  // mypw contains the hr schema password
            connectString: process.env.oracleConnectString,
            poolAlias: "broadcastx"
        });
        pool["broadcastx"] = true;
    } catch (err) {
        pool["broadcastx"] = false;
        console.error(err.message);
        throw new Error("连接池broadcastx创建失败！");
    }
    // }
};

//退出执行函数
async function closePoolAndExit() {
    console.log("\nTerminating");
    try {
        for (var key in pool) {
            await oracledb.getPool(key).close(10);
        }
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

//查询函数
var executeSql = async function (dataSource, sql, param) {
    var pool_flag = pool[dataSource];
    if (!pool_flag) {
        return
    }

    var pool_name = oracledb.getPool(dataSource);
    try {
        var connection = await pool_name.getConnection();
        let result = await connection.execute(sql, param);
        await connection.close();
        return Promise.resolve(result);
    } catch (err) {
        console.log(err.message)
    }

};

initPool();
module.exports.executeSql = executeSql;