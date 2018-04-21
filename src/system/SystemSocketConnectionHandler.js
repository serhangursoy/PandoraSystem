

export const SystemSocketConnectionHandler = function(callback){
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    //const connection = new WebSocket('ws://139.179.103.246:1337');
    const connection = new WebSocket('ws://localhost:1337');
    //const connection = new WebSocket('ws://192.168.1.111:1337');

    connection.onopen = function () {
        console.log("Connection established");
    };

    connection.onerror = function (error) {
        console.log("Connection error!");
        console.warn(error);
    };

    connection.onmessage = function (message) {
        try {
            let json = JSON.parse(message.data);

            if(callback){
                callback(json)
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
                    if(callback !== null){
                        callback();
                    }

                } else {
                    console.log("wait for connection...");
                    waitForSocketConnection(socket, callback);
                }

            }, 5); // wait 5 milisecond for the connection...
    }

    return {
        "adminLogin": function (password) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({type: "ADMIN_LOGIN", password: password}))
            })
        },
        "createGameRoom": function (gameID , adminKey) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({type: "CREATE_GAME_ROOM" , gameID: gameID, key: adminKey}))
            })
        },
        "getActiveGameRoom": function () {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({type: "GET_ACTIVE_GAME_ROOM"}))
            })
        },
        "waitUser": function ( roomID ) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({type: "WAIT_USER", isWaiting: true, gameRoomID: roomID}))
            })
        },
        "getAllRooms": function () {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({type: "GET_ALL_ROOMS"}))
            })
        },
        "joinGameRoom": function (gameRoomID,username) {
            waitForSocketConnection(connection ,function () {
                connection.send(JSON.stringify({type: "ENTER_GAME_ROOM","gameRoomID": gameRoomID , "username": username}));
            })
        },
        "exitGameRoom": function (gameRoomID,username) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({"type": "EXIT_GAME_ROOM", "gameRoomID": gameRoomID, "username": username}))
            })
        },
        "setReadyTrue": function (gameRoomID,username) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({"type": "SET_READY_TRUE", "gameRoomID": gameRoomID, "username": username}))
            })
        },
        "setReadyFalse": function (gameRoomID,username) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({"type": "SET_READY_FALSE", "gameRoomID": gameRoomID, "username": username}))
            })
        },
        "startGame": function (gameRoomID) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({"type": "START_GAME", "gameRoomID": gameRoomID}))
            })
        },
        "exitGame": function (gameRoomID , username) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({"type": "EXIT_GAME_ROOM", "gameRoomID": gameRoomID , "username": username}))
            })
        }

    }

};