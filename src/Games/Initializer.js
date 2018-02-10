import React from "react";
import {games} from "./games";
import {Route} from "react-router-dom";
import AwesomeGame from "./AwesomeGame/awesomeComponent.js";
import TicTacToe from "./TicTacToe/Board.js";
import TodoList from "./TodoList/index.js";
import GameOfLife from "./GameOfLife/GameOfLife.js";
import MemoryGame from "./MemoryGame/MemoryGame.js";
const g = {"AwesomeGame": AwesomeGame,"TicTacToe": TicTacToe,"TodoList": TodoList,"GameOfLife": GameOfLife,"MemoryGame": MemoryGame,};

export const  Initializer = () => {
        let routes = [];
        let key = 0;
        games.forEach(function (game) {
            let pathString = "/"+game.name+"";
            let kn = "game-" + key;
            routes.push(<Route key={kn} path={pathString} component={g[game['name']]}/>);
            key = key + 1
        });
        console.log("Get loaded games");
        console.log(routes);
        return routes;
};