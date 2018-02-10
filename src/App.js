import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {SystemConnection} from "./SystemConnection"
import {Initializer} from "./Games/Initializer"
import SystemScreensContainer from "./system/SystemScreensContainer";

class App extends Component {


    constructor(){
        super();
        this.state = {};
        const connectionID = this.getConnectionID();
        this.state.connectionID = connectionID;
        this.state.systemState = this.getSystemState(this.connectionID)
    }

    getConnectionID(){
        return SystemConnection.getConnectionID()
    }

    getSystemState(){
        return SystemConnection.getSystemState(this.state.connectionID)
    }





  render() {
        console.log("App State!!");
        console.log(this.state);
        let elem = null;

        if (this.state.systemState.gameInProgress) {
            elem = Initializer(this.state.systemState.gameID)
        }
        else {
            elem = <SystemScreensContainer/>
        }


    return (
        elem
    );
  }
}

export default App;
