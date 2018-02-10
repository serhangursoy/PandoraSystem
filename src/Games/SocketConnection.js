


export const SocketConnection = {
    getGameState: function (callback) {
        console.log("getGameState");

        if(this.state !== "recieved state")
            callback({text: "recieved state"});
    },
    sendGameState: function () {
        console.log(this.state);
    },
    dispatchActionToServer: function () {
      console.log("dispatchActionToServer");
    },
    startGame: function () {
        console.log("startGame");
    },
    exitGame: function () {
      console.log("exitGame");
    },

    reduxListener: function (state) {
        console.log("reduxListener");
        console.log(state);
    }

};