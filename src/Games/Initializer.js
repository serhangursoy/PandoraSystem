import React from "react";
import {games} from "./games";
import {Route} from "react-router-dom";
import {SocketHandler} from "../system/SocketHandler";
import AwesomeGame from "./AwesomeGame/awesomeComponent.js";
import TicTacToe from "./TicTacToe/Board.js";
import TodoList from "./TodoList/index.js";
import ButtonPressAdventure from "./ButtonPressAdventure/game_index.js";
import GameOfLife from "./GameOfLife/GameOfLife.js";
import MemoryGame from "./MemoryGame/MemoryGame.js";
const g = {"AwesomeGame": AwesomeGame,"TicTacToe": TicTacToe,"TodoList": TodoList,"ButtonPressAdventure": ButtonPressAdventure,"GameOfLife": GameOfLife,"MemoryGame": MemoryGame,};

export const  Initializer = (gameID,gameRoomID) => {
    let SelectedGame = null;
    games.forEach(function (game) {
        if (game.id == gameID) {
            SelectedGame = g[game.name]
        }
    });

    if(SelectedGame)
        return <SelectedGame connection = {SocketHandler.newGameSocketConnection.bind({gameRoomID: gameRoomID})}/>;
    else
        return <p>ERROR WHILE LOADING THE GAME</p>
};

