# 广播
    server端主动发送广播给客户端
    
## client
client分为：**user**和**group**两种类型。

user：一个user在只允许一个链接注册（一个链接对应js意味着一个io.connection）。

group：一个group可以允许多个链接注册。

调用register事件进行注册，

注册完成之后，假如有第三方或者服务内部需要发送给你信息，那么会根据你注册的user和group进行数据发送，你们之间只需约定好事件名称即可。

假如需要注销，不再收到消息，则可以调用unRegister事件进行注销。

broadcastInfo用于第三方发送给对应user或者group数据，相应事件eventName和内容text（内容可以是文本或者json）。

注：假如发送目标group包含发送人自己，发送人是不会收到消息的。
  
## client javascript
请求目录下有对应JS包，目前采用socket.io 2.1.0
    <pre><code><script type="text/javascript" src="/socket.io/socket.io.js"></script></code></pre>
    
- 代码例子

    <pre><code>
    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    <script>
        var socket = io.connect('http://localhost:3000');
        socket.on("connect",function () {
            socket.emit("register", {"user": "6A2C1FBC70FE38EEE050007F010061E5"});
        });
    
        socket.on("receive", function (data) {
            console.log(data)
        });
    
        function sendGroupRegister() {
            socket.emit("register", {"group": "vvv"});
        }

        function sendUserDCN() {
            var data = {};
            data.roomName = "xxx";
            data.eventName = "countMsg";
            data.text = 99;
            socket.emit("broadcastInfo", data,function(resp){console.log(resp)});
        }
    
        function sendGroupDCN() {
            var data = {};
            data.roomName = "vvv";
            data.eventName = "receive";
            data.text = 100;
            socket.emit("broadcastInfo", data,function(resp){console.log(resp)});
        }
    </script>
    </code></pre>
    
客户端可以发送三个公共事件：register,unRegister,broadcastInfo，

所有事件客户端在emit方法最后增加一个参数来获取服务端就这次请求返回的response相应：socket.emit("broadcastInfo", data,function(resp){console.log(resp)});

假如不添加则不会有此次response，也就是这次发送操作，你无法知道服务端是否有成功接收。

response格式：
- flag：0失败，1成功
- messageType：代表此次返回的类型。register,unRegister,broadcastInfo
- messageLevel：代表此次返回的级别。err,info,warn

message：代表此处返回的内容
{flag:"1",messageType:"register",messageLevel:"warn",message:"login repeated!unRegister the older one!"}

**register**

- 用户名，重复注册，会自动注销之前注册的用户

>例子：{"user": "6A2C1FBC70FE38EEE050007F010061E5"}

- 群组，允许重复注册

>例子：{"group": "vvv"}

**unRegister**

- 注销用户名

>例子：{"user": "6A2C1FBC70FE38EEE050007F010061E5"}

- 注销群组

>例子：{"group": "vvv"}

**broadcastInfo**

- roomName
发送房间名

- eventName
发送事件名称

- text
发送内容

>例子：{"roomName":"xxx","eventName":"countMsg","text":"99"}
{"roomName":"xxx","eventName":"countMsg","text":{"data","sdfdsf"}}

## client java

gradle对应：
    <pre><code>
    api ('io.socket:socket.io-client:1.0.0') {
        // excluding org.json which is provided by Android
        exclude group: 'org.json', module: 'json'
    }
    api ('io.socket:engine.io-client:1.0.0') {
        // excluding org.json which is provided by Android
        exclude group: 'org.json', module: 'json'
    }
    </code></pre>

socketIO Java:[This link](https://github.com/socketio/socket.io-client-java)

npm:[This link](https://www.npmjs.com/package/broadcastnodejs)

docket:[This linke](https://github.com/AnsonLoveLina/webrtcDocker)
