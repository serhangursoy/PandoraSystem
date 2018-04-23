





import {SystemSocketConnectionHandler} from "./SystemSocketConnectionHandler";
import {GameSocketConnection} from "../Games/GameSocketConnection";
import {ServerNotification} from "./ServerNotification"

export const SocketHandler = function () {
    let SystemSocket = null;


    return {
        "newSystemSocketConnection": function (callFunc) {
            if(!SystemSocket)
                SystemSocket = SystemSocketConnectionHandler(callFunc);
            return SystemSocket
        },
        "newGameSocketConnection": function (callback) {
            return SystemSocket.setGameConnection(callback)
        },
    }
}();