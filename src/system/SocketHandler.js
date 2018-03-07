





import {SystemSocketConnectionHandler} from "./SystemSocketConnectionHandler";
import {GameSocketConnection} from "../Games/GameSocketConnection";
import {ServerNotification} from "./ServerNotification"

export const SocketHandler = function () {
    let SystemSocket = null;
    let GameSocket = null;


    return {
        "newSystemSocketConnection": function (callFunc) {
            if(!SystemSocket)
                SystemSocket = SystemSocketConnectionHandler(callFunc);
            return SystemSocket
        },
        "newGameSocketConnection": function (gameRoomID , callback) {
            GameSocket = GameSocketConnection(gameRoomID , callback);
            return GameSocket
        },
    }
}();