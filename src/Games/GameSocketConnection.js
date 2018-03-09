


export const GameSocketConnection = function(gameRoomID , callback){
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    //const connection = new WebSocket('ws://127.0.0.1:1337');
    const connection = new WebSocket('ws://139.179.194.218:1337');

    connection.onopen = function () {
        console.log("Connection established");
    };

    connection.onerror = function (error) {
        console.log("Connection error!");
    };

    connection.onmessage = function (message) {
        let json = JSON.parse(message.data);
        console.log("Printing parsed message", json);
        switch(json.type){
            case "STATE_UPDATE":
                callback(json.state);
                break;
            default:
                console.log("UNRECOGNIZED MESSAGE: ", json)
        }
    };



    function waitForSocketConnection(socket, callback){
        setTimeout(
            function () {
                if (socket.readyState === 1) {
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
                    connection.send(JSON.stringify({type: "STATE_UPDATE", gameRoomID: gameRoomID , state: state }));
                })

        },
        "enterGame": function () {
            console.log("Sending Enter Game");
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({type: "ENTER_GAME" , gameRoomID: gameRoomID}))
            })

        }

    }

};