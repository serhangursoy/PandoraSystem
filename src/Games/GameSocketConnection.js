


export const SocketConnection = function(gameRoomID , callback){
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    const connection = new WebSocket('ws://127.0.0.1:1337');


    connection.onopen = function () {
        console.log("Connection established");
    };

    connection.onerror = function (error) {
        console.log("Connection error!");
    };

    connection.onmessage = function (message) {
        try {
            let json = JSON.parse(message.data);
            switch(json.type){
                case "STATE_UPDATE":
                    callback(json.state);
                    break;
                default:
                    console.log("UNRECOGNIZED MESSAGE: " + json)
            }
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ',
                message.data);
        }

    };



    function waitForSocketConnection(socket, callback){
        setTimeout(
            function () {
                if (socket.readyState === 1) {
                    console.log("Connection is made");
                    if(callback !== null){
                        callback();
                    }

                } else {
                    console.log("wait for connection...")
                    waitForSocketConnection(socket, callback);
                }

            }, 5); // wait 5 milisecond for the connection...
    }

    return {
        "sendNewState": function (state) {
                waitForSocketConnection(connection ,function () {
                    connection.send(JSON.stringify({"type": "STATE_UPDATE","gameRoomID": gameRoomID , "state": state}));
                })

        }

    }

};