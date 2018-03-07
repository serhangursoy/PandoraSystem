import React, { Component } from 'react';
import './App.css';
import GamesScreenContainer from "./Games/GamesScreenContainer";
import SystemScreensContainer from "./system/SystemScreensContainer"

class App extends Component {


    constructor(){
        super();
        this.state = {};
    }


  render() {
        console.log("App State!!");
        console.log(this.state);

    return (
       // <GamesScreenContainer selectedGame="TicTacToe" gameID={"985ebfa1-33f3-48fa-87cc-9e5a1170b014"} gameRoomID={1}/>
        <SystemScreensContainer/>
    );
  }
}

export default App;
