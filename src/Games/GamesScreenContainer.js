import React, { Component } from 'react';

import './GamesScreenStyle.css';
import {Initializer} from './Initializer'
import {games} from "./games.js"


let selectedGame = Initializer("c617fcd9-edb3-486e-b2bf-0c610b78275c");

class GamesScreenContainer extends Component {
    constructor(){
        super();
        this.state = {
            installedGames: games
        }

    }



    render() {



        return (
                <div className="App">
                    <header className="App-header">
                        <img src="https://cdn3.iconfinder.com/data/icons/brain-games/1042/Tic-Tac-Toe-Game-grey.png" className="App-logo" alt="logo"/>
                        <h1 className="App-title">Welcome to Pandora</h1>
                    </header>
                    <div className="GameContainer" style={{margin: "auto",width: "100%"}}>
                        {selectedGame}
                    </div>
                </div>
        );
    }
}

export default GamesScreenContainer;
