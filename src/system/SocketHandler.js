





import {SystemSocketConnectionHandler} from "./SystemSocketConnectionHandler";
import {GameSocketConnection} from "../Games/GameSocketConnection";
import {ServerNotification} from "./ServerNotification"
import {GameNotification} from "./GameNotification";

export const SocketHandler = function () {
    let SystemSocket = null;
    let GameSocket = null;


    return {
        "newSystemSocketConnection": function () {
            if(!SystemSocket)
                SystemSocket = SystemSocketConnectionHandler(ServerNotification);
            return SystemSocket
        },
        "newGameSocketConnection": function (gameRoomID) {
            GameSocket = GameSocketConnection(gameRoomID , GameNotification);
            return GameSocket
        },
    }
}();