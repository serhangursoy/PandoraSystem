import React, { Component } from 'react';

import './GamesScreenStyle.css';
import {Initializer} from './Initializer'
import {games} from "./games.js"
import ICON from "../image/favicon.png";

//let selectedGame = Initializer("f1cc46ef-8525-444b-af88-a4c90cb9bcdc", 1);



class GamesScreenContainer extends Component {
    constructor(props){
        super();
        console.log(props);
        this.state = {
            installedGames: games,
            selectedGame: Initializer(props.gameID , props.gameRoomID, props.users, props.isAdmin)
        }

    }



    render() {
        return (
                <div className="App">
                    <div className="GameContainer" style={{margin: "auto",width: "100%"}}>
                        {this.state.selectedGame}
                    </div>
                </div>
        );
    }
}

export default GamesScreenContainer;
