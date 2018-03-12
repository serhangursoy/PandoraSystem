import React from "react";
import {games} from "./games";
import {SocketHandler} from "../system/SocketHandler";
import TicTacToe from "./TicTacToe/Board.js";
import ButtonPressAdventure from "./ButtonPressAdventure/game_index.js";
import MemoryGame from "./MemoryGame/MemoryGame.js";
import TruthOrDare from "./TruthOrDare/game_index";
import CelebrityHeads from "./Celebrity/game_index";

const g = {"TicTacToe": TicTacToe,"ButtonPressAdventure": ButtonPressAdventure,"MemoryGame": MemoryGame, "TruthOrDare": TruthOrDare, "CelebrityHeads": CelebrityHeads};

export const  Initializer = (gameID,gameRoomID, userList) => {
    console.log("initializer gameid: ", gameID);
    let SelectedGame = null;
    games.forEach(function (game) {
        console.log(game);
        if (game.id == gameID) {
            SelectedGame = g[game.name]
        }
    });


    if(SelectedGame)
        return <SelectedGame connection = {SocketHandler.newGameSocketConnection.bind({gameRoomID: gameRoomID})}  users={userList} gameRoomID={gameRoomID}/>;
    else
        return <p>ERROR WHILE LOADING THE GAME</p>
};

