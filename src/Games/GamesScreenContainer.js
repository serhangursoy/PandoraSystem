import React, { Component } from 'react';

import './GamesScreenStyle.css';
import {Initializer} from './Initializer'
import {Switch} from "react-router-dom";
import {games} from "./games.js"


let routes = Initializer();
console.log("Got routes");
console.log(routes);
class GamesScreenContainer extends Component {
    constructor(){
        super();
        this.state = {
            installedGames: games
        }
    }



    render() {

        let routeObjects = routes.map(function (route) {
            return route;
        });

        console.log(routeObjects);

        return (
                <div className="App">
                    <header className="App-header">
                        <img src="https://cdn3.iconfinder.com/data/icons/brain-games/1042/Tic-Tac-Toe-Game-grey.png" className="App-logo" alt="logo"/>
                        <h1 className="App-title">Welcome to Pandora</h1>
                    </header>
                    <div className="GameContainer" style={{margin: "auto",width: "100%"}}>
                        <Switch>
                            {routeObjects}
                        </Switch>
                    </div>
                </div>
        );
    }
}

export default GamesScreenContainer;
