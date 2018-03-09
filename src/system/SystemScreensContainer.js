import React, { Component } from 'react';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import AdminMenu from '../screens/AdminMenu'
import CreateGame from '../screens/CreateGame';
import GameLobby from '../screens/GameLobby';
import GameRooms from '../screens/GameRooms';
import Cookies from 'universal-cookie';
import AdminSettings from "../screens/AdminSettings";
import {SocketHandler} from "./SocketHandler";
import {ServerActions} from "./ServerActions";
import GamesScreenContainer from "../Games/GamesScreenContainer";

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
                let tmpState = this.state;
              //  if(this.state.loginHandler.isLogged)
                    tmpState.AdminHandler.selectedGame.gameDetails = event.room;
           //     else
                    tmpState.GuestHandler.gameDetails = event.room;
                this.setState(tmpState);
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
                console.log(event);
                break;
            case ServerActions.joinGameRoom:
                console.log("Join game room");
                console.log(event);
                tmpState = this.state;
                if(this.state.loginHandler.isLogged) {
                    console.log("admin going to lobby :):):)");
                    tmpState.AdminHandler.selectedGame.isSelected = true;
                    tmpState.AdminHandler.selectedGame.gameDetails = event.room;
                    tmpState.AdminHandler.selectedGame.gameDetails.isAdmin = false;
                    tmpState.AdminHandler.selectedGame.gameDetails.username = this.state.AdminHandler.adminUsername;
                }else {
                    console.log("guest going to lobby :):):)");
                    tmpState.GuestHandler.gameDetails = event.room;
                    tmpState.GuestHandler.joinedRoom = true;
                    tmpState.GuestHandler.showRooms = false;
                }
                this.setState(tmpState);
                break;
            case ServerActions.getAllRooms:
                console.log("get all rooms");
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
                console.log("USERLARDAN BIRISI DÜŞTÜ, ALLAHU ACKBAR;)");
                /*
                tmpState = this.state;
                if(this.state.loginHandler.isLogged)
                    tmpState.AdminHandler.selectedGame.gameDetails = event.room;
                else
                    tmpState.GuestHandler.gameDetails = event.room;
                this.setState(tmpState);
*/
                break;
            case ServerActions.userReadyStateChanged:
                tmpState = this.state;
                console.log("Stateler değişti, orta gamelobbyde kartlar yeniden karılıyor! Yeni event... ", event);
               // if(this.state.loginHandler.isLogged)
                    tmpState.AdminHandler.selectedGame.gameDetails = event.room;
              //  else
                    tmpState.GuestHandler.gameDetails = event.room;
                this.setState(tmpState);
                break;

            case ServerActions.startGame:
                console.log("Starting Game for everyone!... ");
                console.log(event);
                tmpState = this.state;
                tmpState.AdminHandler.selectedGame.gameDetails = event.room;
                tmpState.GuestHandler.gameDetails = event.room;
                this.setState(tmpState);
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

    startGame( gameRoomID ) {
        console.log("Start game from frontend, ID " , gameRoomID);
       this.state.connection.startGame(gameRoomID);
    }

    adminLogin( passphrase ) {
        console.log("Admin login request, input:" + passphrase);
        this.state.connection.adminLogin(passphrase);
    }

    createGameClicked(gameID,userName) {
        this.state.connection.createGameRoom(gameID , cookies.get("adminKey"));
        cookies.set("uname", userName);
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

        console.log("Someone changed its state.. ", username, " to ", readyStatus, " in gameroom", gameRoomID);
        if(readyStatus)
            this.state.connection.setReadyTrue(gameRoomID, username);
        else
            this.state.connection.setReadyFalse(gameRoomID, username);
    }


    goGameRooms() {
        console.log("kankalarla go game room keyfi");
        this.state.connection.getAllRooms();
    }

    joinGameRoom(gameRoomID, username){
        cookies.set("uname", username);
        this.state.connection.joinGameRoom(gameRoomID, username);
    }
    /*
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
    */

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
                        return <GameLobby gameDetails={this.state.AdminHandler.selectedGame.gameDetails} userReady={ this.userIsReady.bind(this)} startGame={this.startGame.bind(this)}/>
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
     //   console.log("render: ", this.state);
        let page = this.calculatePage();
        return (<div>{ page }</div>);
    }
}

export default SystemScreensContainer;
