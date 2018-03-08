import React, { Component } from 'react';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import AdminMenu from '../screens/AdminMenu'
import CreateGame from '../screens/CreateGame';
import GameLobby from '../screens/GameLobby';
import GameRooms from '../screens/GameRooms';
import Cookies from 'universal-cookie';
import AdminSettings from "../screens/AdminSettings";
import {SystemSocketConnectionHandler} from "./SystemSocketConnectionHandler";
import {SocketHandler} from "./SocketHandler";
import {ServerActions} from "./ServerActions";

const cookies = new Cookies();
const isDebug = true;
//const API = "http://35.202.126.234:3000/api/";
const API = "http://127.0.0.1:3000/api/";
class SystemScreensContainer extends Component {



    constructor() {
        var debug= false;
        super();
        this.state = {
            connection: SocketHandler.newSystemSocketConnection(this.SocketHandlerFunction.bind(this)),
            dummyButton: "false",
            loginHandler: {
                loginFailed: debug,
                isLogged: debug
            },
            AdminHandler: {
                createNewGame: false,
                goToSettings: false,
                adminUsername: null,
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
            },
            goToGame: false,
            gameRoomState: null
        };
    }


    SocketHandlerFunction (event) {
        let tmpState = this.state;
        switch (event.type) {
            case ServerActions.userJoined:
                console.log("User joined!!!!!!");
                console.log(event);
                this.setState({gameRoomState: event.room});
                break;
            case ServerActions.adminLogin:
                console.log("Admin hazretleri.. Key: " + event.key);
                cookies.set("adminKey", event.key);
                this.setState({loginHandler: {isLogged: true}});
                break;
            case ServerActions.createGameRoom:
                console.log("Creating game room..");
                console.log(event);
                console.log(this.state.AdminHandler.adminUsername);
                this.state.connection.joinGameRoom(event.gameRoom.gameRoomID , this.state.AdminHandler.adminUsername);
                this.setState({goToGame: true});
                console.log(event);
                break;
            case ServerActions.joinGameRoom:
                console.log("Logged in!");
                console.log(event);
                let tmpState = this.state;
                tmpState.AdminHandler.selectedGame.isSelected = true;
                tmpState.AdminHandler.selectedGame.gameDetails = event;
                tmpState.AdminHandler.selectedGame.gameDetails.isAdmin = false;
                tmpState.AdminHandler.selectedGame.gameDetails.username = this.state.AdminHandler.adminUsername;
                this.setState(tmpState);
                break;
            case ServerActions.getAllRooms:
                console.log(event);
                tmpState = this.state;
                tmpState.GuestHandler.gameRoomData = event.roomList;
                tmpState.GuestHandler.showRooms = true;
                this.setState(tmpState);
                break;
            case ServerActions.getActiveGameRoom:
                console.log("Active game room sonuçları geldi kardeş");
                break;
            case ServerActions.error:
                console.log("bi yerde sıkıntı çıktı detaylı neden aşağıda");
                console.log(event.message);
                break;
            case ServerActions.userExit:
                console.log("User çıktı yeni game room objesi gelmiştir ;)");
                this.setState({gameRoomState: event.room});
                console.log(event.room);
                break;
            default:
                new Error("Server Action not recognized");
                break;
        }
    }
    // Bind functions
    dummyClicked() {
        let tmpState = this.state;
        tmpState.dummyButton = true;
        this.setState(tmpState);
    }

    adminLogin( passphrase ) {
        console.log("Admin login request, input:" + passphrase);
        this.state.connection.adminLogin(passphrase);
    }

    createGameClicked(gameID,userName) {
        this.state.connection.createGameRoom(gameID , cookies.get("adminKey"));
        let tmpState = this.state;
        tmpState.AdminHandler.adminUsername = userName;
        this.setState(tmpState);
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
    /*
    joinGameRoom(roomID, username) {

        console.log("Join Req from our lovely lad.. Room #:" + roomID +  "| Username:" + username);

        SystemSocketConnectionHandler(roomID, console.log).joinGameRoom(username);



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
*/

    goGameRooms() {
        let tmpState = this.state;
        console.log("kankalarla go game room keyfi");
        this.state.connection.getAllRooms();
        /*
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
        */
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
                        return <Login adminLogin={this.adminLogin.bind(this)}
                                      isLoginFailed={this.state.loginHandler.loginFailed}
                                      goGameRooms={this.goGameRooms.bind(this)}/>
                    }
                }
            }
        }
    }

    render() {
        console.log("render: ", this.state);
        let page = this.calculatePage();
        return (<div>{ page }</div>);
    }
}

export default SystemScreensContainer;
