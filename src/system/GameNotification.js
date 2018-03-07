




import {ServerActions} from "./ServerActions";

export const GameNotification = function (event) {
    switch (event.type){
        case ServerActions.stateUpdate:
            console.log("New State Came!!!!!!");
            console.log(event);
            break;
        default:
            new Error("Server Action not recognized");

    }

};