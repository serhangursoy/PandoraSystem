

export const SystemConnection = {

    getConnectionID: () => {
        return 1
    },

    getGameInProgress: (connectionID) => {
        return {
            "name": "MemoryGame",
            "playerCount": 1,
            "entryClass": "MemoryGame.js"
        }
    },

    getSystemState: (connectionID) => {
        return {
            gameInProgress: false,
            gameID: "MemoryGame",
            gameRoomID: "PlayingWithFriends"
        }
    }

};