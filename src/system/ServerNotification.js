


import {ServerActions} from "./ServerActions";

export const ServerNotification = function (event) {
    switch (event.type){
        case ServerActions.userJoined:
            console.log("User joined!!!!!!");
            break;
        case ServerActions.getActiveGameRoom:
            console.log("Active game room sonuçları geldi kardeş");
            break;
        case ServerActions.error:
            console.log("bi yerde sıkıntı çıktı detaylı neden aşağıda");
            console.log(event.message);
            break;
        case ServerActions.userExit:
            console.log("User çıktı yeni game room objesi gelmiştir ;)");
            console.log(event.gameRoom);
            break;
        default:
            new Error("Server Action not recognized")




    }

};