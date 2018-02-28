import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Initializer} from "./Games/Initializer"
import SystemScreensContainer from "./system/SystemScreensContainer";
import GamesScreenContainer from "./Games/GamesScreenContainer";
import {BrowserRouter, Router} from "react-router-dom";

class App extends Component {


    constructor(){
        super();
        this.state = {};
    }


  render() {
        console.log("App State!!");
        console.log(this.state);

    return (
        //<BrowserRouter>
        //    <GamesScreenContainer selectedGame="ButtonPressAdventure"/>
        //</BrowserRouter>
        <SystemScreensContainer/>
    );
  }
}

export default App;
