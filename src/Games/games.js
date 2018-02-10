import comp0 from "./AwesomeGame/awesomeComponent.js"
import comp1 from "./TicTacToe/Board.js"
import comp2 from "./TodoList/index.js"
import comp3 from "./GameOfLife/GameOfLife.js"
import comp4 from "./MemoryGame/MemoryGame.js"
import React from 'react'
export const games =[
    {
        "name": "AwesomeGame",
        "playerCount": 4,
        "entryClass": "awesomeComponent.js"
    },
    {
        "name": "TicTacToe",
        "playerCount": 2,
        "entryClass": "Board.js"
    },
    {
        "name": "TodoList",
        "playerCount": 1,
        "entryClass": "index.js"
    },
    {
        "name": "GameOfLife",
        "playerCount": 1,
        "entryClass": "GameOfLife.js"
    },
    {
        "name": "MemoryGame",
        "playerCount": 1,
        "entryClass": "MemoryGame.js"
    }
];
