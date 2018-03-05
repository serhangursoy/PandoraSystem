
import {ServerActions} from "./ServerActions"



//Server actions are defined in ServerActions
// Callback object is for defining callbacks for each action.
/*
    Example callback obj
    {
        userJoined: function(gameRoomState) {
            console.log("New game room state: " + gameRoomState);
        }
        userExit: function(gameRoomState) {
            console.log("New game room state: " + gameRoomState);
        }
        etc...
    }
 */
//create the GameRoomSocketConnectionHandler with a specific gameRoomID as first parameter
//After creating GameRoomSocketConnectionHadnler can be used as fallows:
/* s = GameRoomSocketConnectionHandler(6)
    s.joinGameRoom({connID: 4, username: "Ege", "ready": false});
    s.exitGameRoom("Ege")
    s.setReadyTrue("Ege")

    etc...

 */


export const GameRoomSocketConnectionHandler = function(gameRoomID , callbackObj){
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    const connection = new WebSocket('ws://127.0.0.1:1337');


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
            switch(json.type){
                case ServerActions.userJoined:
                    callbackObj.userJoined? callbackObj.userJoined(json): null;
                    break;
                case ServerActions.userExit:
                    callbackObj.userExit? callbackObj.userExit(json): null;
                    break;
                case  ServerActions.userReadyStateChanged:
                    callbackObj.userReadyStateChanged? callbackObj.userReadyStateChanged(json): null;
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
                    console.log("wait for connection...");
                    waitForSocketConnection(socket, callback);
                }

            }, 5); // wait 5 milisecond for the connection...
    }

    return {
        "joinGameRoom": function (user) {
            waitForSocketConnection(connection ,function () {
                connection.send(JSON.stringify({"type": "ENTER_GAME_ROOM","gameRoomID": gameRoomID , "user": user}));
            })
        },
        "exitGameRoom": function (username) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({"type": "EXIT_GAME_ROOM", "gameRoomID": gameRoomID, "username": username}))
            })
        },
        "setReadyTrue": function (username) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({"type": "SET_READY_TRUE", "gameRoomID": gameRoomID, "username": username}))
            })
        },
        "setReadyFalse": function (username) {
            waitForSocketConnection(connection, function () {
                connection.send(JSON.stringify({"type": "SET_READY_FALSE", "gameRoomID": gameRoomID, "username": username}))
            })
        }

    }

};