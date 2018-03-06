import React, { Component } from 'react';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import AdminMenu from '../screens/AdminMenu'
import CreateGame from '../screens/CreateGame';
import GameLobby from '../screens/GameLobby';
import GameRooms from '../screens/GameRooms';
import Cookies from 'universal-cookie';
import AdminSettings from "../screens/AdminSettings";

const cookies = new Cookies();
const isDebug = true;
//const API = "http://35.202.126.234:3000/api/";
const API = "http://127.0.0.1:3000/api/";
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
                goToSettings: false,
                selectedGame: {
                    isSelected: false,
                    gameDetails: null
                }
            },
            GuestHandler: {
                showRooms: false,
                joinedRoom: false,
                gameRoomData: null,
                gameDetails: null
            }
        };
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

        fetch(API + 'loginAdmin', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify({
                password: passphrase
            })
        }).then(response => {

            if(response.ok) {
                let someJSON = response.json();
                console.log("Logged in! Message: " , someJSON);
                let tmpState = this.state;
                tmpState.loginHandler.isLogged = true;
                this.setState(tmpState);
                return true;
            } else {

                if (isDebug) {
                    let someJSON = response.json();
                    console.log("Logged in! Message: " , someJSON);
                    let tmpState = this.state;
                    tmpState.loginHandler.isLogged = true;
                    this.setState(tmpState);
                    return true;
                }
                return false;
            }
        }
        ).catch( function(err) {
            // Handle error in here! It means login failed!
            console.log("Error!" ,  err);
        } );
    }
    createGameClicked(gameID,userName) {
        if (cookies.get("connID") == null) {
        fetch(API + 'getConnIdAdmin', {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then(response => response.json()).then((response) => {
            let userConnID = response.connID;
            cookies.set("connID", userConnID);
            this.continueGameClicked(userConnID,gameID,userName);
        });
        } else {

            console.log("We already have admin connection ID. No need to create new one..");
            console.log("Game ID : " + gameID + " Username:"+userName);
            this.continueGameClicked( cookies.get("connID"),gameID,userName);
        }
    }
    continueGameClicked(connID,gameID,userName) {

        fetch(API + 'createRoom', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify({
                gameID: gameID
            })
        }).then(response => response.json()).then((response) => {
            let tmpRoomID = response.gameRoomID;

            fetch(API + 'enterGameRoom', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type': 'application/json'
                },
                body:  JSON.stringify({
                    connID: connID,
                    username: userName,
                    gameRoomID: tmpRoomID
                })
            }).then(response => response.json()).then((response) => {
                console.log("Logged in!");
                let tmpState = this.state;
                tmpState.AdminHandler.selectedGame.isSelected = true;
                tmpState.AdminHandler.selectedGame.gameDetails = response;
                tmpState.AdminHandler.selectedGame.gameDetails.isAdmin = false;
                tmpState.AdminHandler.selectedGame.gameDetails.username = userName;
                tmpState.AdminHandler.selectedGame.gameDetails.ourConnID = parseInt(cookies.get("connID"));
                this.setState(tmpState);
                return true;
            }).catch( function(err) {
                // Handle error in here! It means login failed!
                console.log("Error!" ,  err);
            } );
        });

    }
    createNewGame() {
        console.log("Creating new game..");
        let tmpState = this.state;
        tmpState.AdminHandler.createNewGame = true;
        this.setState(tmpState);
    }
    settingClicked() {
        console.log("Going to settings..");
        let tmpState = this.state;
        tmpState.AdminHandler.goToSettings = true;
        this.setState(tmpState);
    }
    userIsReady(username, readyStatus,gameRoomID){
        fetch(API + 'setPlayerReady', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify({
                connID: cookies.get("connID"),
                username: username,
                readyStatus: readyStatus,
                gameRoomID: gameRoomID
            })
        }).then(response => response.json()).then((response) => {
        }).catch( function(err) {
            // Handle error in here! It means login failed!
            console.log("Error!" ,  err);
        } );

    }
    joinGameRoom(roomID, username) {

        console.log("Join Req from our lovely lad.. Room #:" + roomID +  "| Username:" + username);

        fetch(API + 'enterGameRoom', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify({
                connID: cookies.get("connID"),
                username: username,
                gameRoomID: roomID
            })
        }).then(response => response.json()).then((response) => {
            let tmpState = this.state;
            tmpState.GuestHandler.joinedRoom = true;
            tmpState.GuestHandler.gameDetails = response;
            tmpState.GuestHandler.gameDetails.isAdmin = false;
            tmpState.GuestHandler.gameDetails.username = username;
            tmpState.GuestHandler.gameDetails.ourConnID = cookies.get("connID");
            this.setState(tmpState);
        }).catch( function(err) {
            // Handle error in here! It means login failed!
            console.log("Error!" ,  err);
        } );



    }
    goGameRooms() {
        let tmpState = this.state;

        fetch(API + 'loginGuest', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin':'*'
            }
        }).then(response => response.json()).then((response) => {

            if (cookies.get("connID") == null) {
                fetch(API + 'getConnIdGuest', {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(response => response.json()).then((response) => {
                    let userConnID = response.connID;
                    cookies.set("connID", userConnID);
                });

            } else {
                console.log("Already have conn ID, no need to send query again")
            }


            fetch(API + 'getAllRooms', {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }).then(responseA => responseA.json()).then((responseA) => {

                console.log("Listing game rooms..");
                tmpState.GuestHandler.gameRoomData = responseA.activeGameRooms;
                tmpState.GuestHandler.showRooms = true;
                this.setState(tmpState);
            });

        }).catch( function(err) {
            // Handle error in here! It means login failed!
            console.log("Error!" ,  err);
        } );

    }
    changewifiSettings(wifi_name,wifi_pass){
        console.log("Send change request");

        fetch(API + 'setwifi', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify({
                wifiName: wifi_name,
                wifiPass: wifi_pass
            })
        }).then(responseA => responseA.json()).then((responseA) => {
            return true;
        }).catch( function (err) {
            return false;
        }
        );

    }

    resetBox() {
        console.log("This will reset box...");
    }


    // This will do the heavy work!
    calculatePage() {
        if(this.state.dummyButton === "false") {
            return <Welcome dummyClicked={this.dummyClicked.bind(this)}/>
        }
        else {
            if (this.state.loginHandler.isLogged) {
                if (this.state.AdminHandler.createNewGame) {
                    if (this.state.AdminHandler.selectedGame.isSelected) {
                        return <GameLobby gameDetails={this.state.AdminHandler.selectedGame.gameDetails} userReady={ this.userIsReady.bind(this)}/>
                    } else {
                        return <CreateGame createGameClicked={this.createGameClicked.bind(this)}/>;
                    }
                } else if(this.state.AdminHandler.goToSettings){
                    return <AdminSettings changeWifiSettings={this.changewifiSettings.bind(this)} resetBox={this.resetBox.bind(this)}/>
                } else {
                    return <AdminMenu adminCreateGame={this.createNewGame.bind(this)} adminClickSettings={this.settingClicked.bind(this)}/>
                }
            } else {

                if (this.state.GuestHandler.joinedRoom) {
                    return <GameLobby gameDetails={this.state.GuestHandler.gameDetails} userReady={ this.userIsReady.bind(this)}/>
                } else {
                    if (this.state.GuestHandler.showRooms) {
                        return <GameRooms gameRooms={this.state.GuestHandler.gameRoomData} joinGameRoom={this.joinGameRoom.bind(this)}/>
                    }else {
                        return <Login getConnectionID={this.getConnectionID.bind(this)}
                                      adminLogin={this.adminLogin.bind(this)}
                                      isLoginFailed={this.state.loginHandler.loginFailed}
                                      goGameRooms={this.goGameRooms.bind(this)}/>
                    }
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
