import React, { Component } from 'react';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import AdminMenu from '../screens/AdminMenu'
import CreateGame from '../screens/CreateGame';
import GameLobby from '../screens/GameLobby';
import GameRooms from '../screens/GameRooms';

class SystemScreensContainer extends Component {

    constructor() {
        var debug= false;
        super();
        this.state = {
            dummyButton: "false",
            loginHandler: {
                loginFailed: debug,
                isLogged: debug
            },
            AdminHandler: {
                createNewGame: false,
                selectedGame: null
            },
            GuestHandler: {
                showRooms: false
            }
        }
    }

    // Bind functions
    dummyClicked() {
        let tmpState = this.state;
        tmpState.dummyButton = true;
        this.setState(tmpState);
    }
    getConnectionID() {
        console.log("You are requesting your connection ID. This is cool. I mean, really. I like it");
    }
    adminLogin( passphrase ) {
        // Assume passphrase is PANDORA
        console.log("Admin login request, input:" + passphrase);

        // ENDPOINT: /api/loginAdmin
        // { password: passhrase }

        if (passphrase === "pandora") {
            console.log("Logged in!");
            let tmpState = this.state;
            tmpState.loginHandler.isLogged = true;
            this.setState(tmpState);
            return true;
        } else {
            return false;
        }
    }
    createGameClicked(gameID) {
        console.log("Game created.. ID: " + gameID);
        let tmpState = this.state;
        tmpState.AdminHandler.selectedGame = gameID;
        this.setState(tmpState);
    }
    createNewGame() {
        console.log("Creating new game..");
        let tmpState = this.state;
        tmpState.AdminHandler.createNewGame = true;
        this.setState(tmpState);
    }

    goGameRooms() {
        console.log("Listing game rooms..");
        let tmpState = this.state;
        tmpState.GuestHandler.showRooms = true;
        this.setState(tmpState);
    }
    // This will do the heavy work!
    calculatePage() {
        if(this.state.dummyButton === "false") {
            return <Welcome dummyClicked={this.dummyClicked.bind(this)}/>
        }
        else {
            if (this.state.loginHandler.isLogged) {
                if (this.state.AdminHandler.createNewGame) {
                    if (this.state.AdminHandler.selectedGame) {
                        return <GameLobby/>
                    } else {
                        return <CreateGame createGameClicked={this.createGameClicked.bind(this)}/>;
                    }
                } else {
                    return <AdminMenu adminCreateGame={this.createNewGame.bind(this)}/>
                }
            } else {

                if (this.state.GuestHandler.showRooms) {
                    return <GameRooms/>
                }else {
                    return <Login getConnectionID={this.getConnectionID.bind(this)}
                                  adminLogin={this.adminLogin.bind(this)}
                                  isLoginFailed={this.state.loginHandler.loginFailed}
                                  goGameRooms={this.goGameRooms.bind(this)}/>
                }
            }
        }
    }

    render() {
        let page = this.calculatePage();
        return (<div>{ page }</div>);
    }
}

export default SystemScreensContainer;
