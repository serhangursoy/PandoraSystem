import React, { Component } from 'react';

import './GamesScreenStyle.css';
import {Initializer} from './Initializer'
import {games} from "./games.js"


//let selectedGame = Initializer("f1cc46ef-8525-444b-af88-a4c90cb9bcdc", 1);



class GamesScreenContainer extends Component {
    constructor(props){
        super();
        console.log(props);
        this.state = {
            installedGames: games,
            selectedGame: Initializer(props.gameID , props.gameRoomID)
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
                        {this.state.selectedGame}
                    </div>
                </div>
        );
    }
}

export default GamesScreenContainer;
