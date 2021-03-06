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
const COOKIE_OPTIONS = { "maxAge": 42000};
class SystemScreensContainer extends Component {



    constructor() {
        var debug= false;
        super();
        this.state = {
            connection: SocketHandler.newSystemSocketConnection(this.SocketHandlerFunction.bind(this)),
            dummyButton: "true",
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
                    gameDetails: null,
                    gameStatus: {
                        isWaiting: false,
                        downPlayer: null,
                        isDecided: false
                    }
                }
            },
            GuestHandler: {
                showRooms: false,
                joinedRoom: false,
                gameRoomData: null,
                gameDetails: null,
                selectedGame: {
                    gameStatus: {
                        isWaiting: false,
                        downPlayer: null,
                        weAreGoing: false,
                        isDecided: false
                    }
                }
            },
            goToGame: false,
            gameRoomState: null
        };

        cookies.remove("adminKey");
        this.isAlreadyInAnyGame();
    }

    componentDidMount() {

    }


    SocketHandlerFunction (event) {
        console.log("GELEN BİŞİLER VAR ", event);
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
                cookies.set("adminKey", event.key, COOKIE_OPTIONS);
                this.setState({loginHandler: {isLogged: true}});
                break;
            case ServerActions.createGameRoom:
                console.log("Creating game room..");
                console.log(event);
                console.log(this.state.AdminHandler.adminUsername);

                tmpState = this.state;

                tmpState.AdminHandler.selectedGame.gameStatus = { isWaiting: false,downPlayer: null,isDecided: false };
                tmpState.GuestHandler.selectedGame.gameStatus = { isWaiting: false,downPlayer: null,weAreGoing: false,isDecided: false};
                this.setState(tmpState);
                cookies.set(event.gameRoom.gameRoomID+"uname", this.state.AdminHandler.adminUsername, COOKIE_OPTIONS);
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
                // Ben boş adamım
                break;
            case ServerActions.userDisconnectedFromGame:
                console.log("User gg");
                tmpState = this.state;
                if(this.state.loginHandler.isLogged) {
                    console.log("Bekleyek mi");
                    tmpState.AdminHandler.selectedGame.gameStatus.isWaiting = true;
                    tmpState.AdminHandler.selectedGame.gameStatus.downPlayer = event.username;
                }else {
                    console.log("Bekleyeceksiniz xd");
                    tmpState.GuestHandler.selectedGame.gameStatus.isWaiting = true;
                    tmpState.GuestHandler.selectedGame.gameStatus.downPlayer = event.username;
                    tmpState.GuestHandler.selectedGame.gameStatus.weAreGoing = event.isDecided;
                }
                this.setState(tmpState);
                break;
            case ServerActions.continueGame:
                tmpState = this.state;
                console.log("devam continue falan geldi..");
                if(this.state.loginHandler.isLogged) {
                    console.log("BÜYÜK BEKLEYİŞ SONA ERDİ");
                    tmpState.AdminHandler.selectedGame.gameStatus.isWaiting = false;
                    tmpState.AdminHandler.selectedGame.gameStatus.isDecided = false;
                    tmpState.AdminHandler.selectedGame.gameStatus.downPlayer = null;
                    /*
                    tmpState.AdminHandler.selectedGame.isSelected = true;
                    tmpState.AdminHandler.selectedGame.gameDetails = event.room;
                    tmpState.AdminHandler.selectedGame.gameDetails.isAdmin = false;
                    tmpState.AdminHandler.selectedGame.gameDetails.username = this.state.AdminHandler.adminUsername;
                    */
                }else {
                    console.log("oyna devam..");
                    tmpState.GuestHandler.gameDetails = event.room;
                    tmpState.GuestHandler.joinedRoom = true;
                    tmpState.GuestHandler.showRooms = false;
                    tmpState.GuestHandler.selectedGame.gameStatus.isWaiting = false;
                    tmpState.GuestHandler.selectedGame.gameStatus.downPlayer = null;
                    tmpState.GuestHandler.selectedGame.gameStatus.weAreGoing = false;
                    tmpState.GuestHandler.selectedGame.gameStatus.isDecided = false;
                }
                this.setState(tmpState);
                break;
            case ServerActions.meExit:
                // Go to menu...
                console.log("I EXIT");
                tmpState = this.state;
                tmpState.GuestHandler.gameDetails = null;
                tmpState.GuestHandler.joinedRoom = false;
                tmpState.GuestHandler.showRooms = false;
                this.setState(tmpState);
                break;
            case ServerActions.roomCreated:
                console.log("room yaratılmış");
                tmpState = this.state;
                tmpState.GuestHandler.gameRoomData.push(event.gameRoom);
                this.setState(tmpState);
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
            case ServerActions.gameRoomClosed:
                console.log(ServerActions.gameRoomClosed);

                tmpState = this.state;
                if(this.state.loginHandler.isLogged) {
                    console.log("admin not going to lobby :):):)");
                    tmpState.AdminHandler.selectedGame.isSelected = false;
                    tmpState.AdminHandler.selectedGame.gameDetails = null;
                }else {
                    console.log("guest not going to lobby :):):)");
                    tmpState.GuestHandler.gameDetails = null;
                    tmpState.GuestHandler.joinedRoom = false;
                    tmpState.GuestHandler.showRooms = false;
                    //tmpState.GuestHandler.gameRoomData = null;
                }
                this.setState(tmpState);

                this.goGameRooms();
                //this.goGameRooms();
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
        cookies.remove("adminKey");
        this.isAlreadyInAnyGame();
        this.setState(tmpState);
    }

    startGame( gameRoomID ) {
        console.log("Start game from frontend, ID " , gameRoomID);
       this.state.connection.startGame(gameRoomID, this.state.AdminHandler.adminUsername);
    }

    exitGame( gameRoomID, username ) {
        console.log("Exit game from frontend, ID " , gameRoomID, username);
        this.state.connection.exitGame(gameRoomID,username);
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

    adminDecision( roomID , dec) {
        if(dec) {
            this.state.connection.waitUser(roomID);
            let tmpState = this.state;
            tmpState.AdminHandler.selectedGame.gameStatus.isDecided = true;
            tmpState.GuestHandler.selectedGame.gameStatus.isDecided = true;
            this.setState(tmpState);
        }else {
            let tmpState = this.state;
            tmpState.AdminHandler.selectedGame.gameStatus.isWaiting = false;
            this.setState(tmpState);
        }
    }


removeAllCookies() {
    let allCookies = cookies.getAll();

    Object.keys(allCookies).forEach( function (kuki) {
        if (kuki != "adminKey")
             cookies.remove(kuki);
    })
}
    joinGameRoom(gameRoomID, username){
        this.removeAllCookies();
        cookies.set(gameRoomID+"uname", username, COOKIE_OPTIONS);
        this.state.connection.joinGameRoom(gameRoomID, username);
    }

    isAlreadyInAnyGame() {

        let allCookies = cookies.getAll();
        console.log(allCookies);

        Object.keys(allCookies).forEach( function (kuki) {
            console.log("KUKİ ", kuki);
            if (kuki != "adminKey") {
                let userOldName = cookies.get(kuki);
                let gameRoomID = kuki.substring(0, kuki.length - 5);
                console.log("heyo" , gameRoomID);
                this.state.connection.joinGameRoom(gameRoomID, userOldName);
            }
        }.bind(this))

    }

    resetBox() {
        console.log("This will reset box...");
        // Call resetting func
    }

    changeWifiSettings(wName,wPass){
        // Call backend to start bash
    }

    goBack() {
        let tmpState = this.state;
        tmpState.AdminHandler.goToSettings = false;
        this.setState(tmpState);
    }

    goBack2() {
        let tmpState = this.state;
        tmpState.AdminHandler.createNewGame = false;
        this.setState(tmpState);
    }


    refreshPage(){
        window.location.reload();
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
                        return <GameLobby  exitGame={this.exitGame.bind(this)} gameDetails={this.state.AdminHandler.selectedGame.gameDetails} userReady={ this.userIsReady.bind(this)} startGame={this.startGame.bind(this)} adminDecision={this.adminDecision.bind(this)} gameStatus={this.state.AdminHandler.selectedGame.gameStatus} exitRoom={this.refreshPage.bind(this)}/>
                    } else {
                        return <CreateGame createGameClicked={this.createGameClicked.bind(this)} goBack={this.goBack2.bind(this)}/>;
                    }
                } else if(this.state.AdminHandler.goToSettings){
                    return <AdminSettings changeWifiSettings={this.changeWifiSettings.bind(this)} resetBox={this.resetBox.bind(this)} goBack={this.goBack.bind(this)}/>
                } else {
                    return <AdminMenu adminCreateGame={this.createNewGame.bind(this)} adminClickSettings={this.settingClicked.bind(this)}/>
                }
            } else {

                if (this.state.GuestHandler.joinedRoom) {
                    return <GameLobby exitGame={this.exitGame.bind(this)} gameDetails={this.state.GuestHandler.gameDetails} userReady={ this.userIsReady.bind(this)} gameStatus={this.state.GuestHandler.selectedGame.gameStatus} exitRoom={this.refreshPage.bind(this)}/>
                } else {
                    if (this.state.GuestHandler.showRooms) {
                        return <GameRooms gameRooms={this.state.GuestHandler.gameRoomData} joinGameRoom={this.joinGameRoom.bind(this)} exitRoom={this.refreshPage.bind(this)}  />
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
