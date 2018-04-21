import React, { Component } from 'react';
import Lobby from '../image/gamelobby.gif';

import Cookies from 'universal-cookie';
import Checked from '../image/checked.png';
import Unchecked from '../image/unchecked.png';
import CheckedU from '../image/checkeduser.png';
import UncheckedU from '../image/uncheckeduser.png';
import {games} from "../Games/games";

import GamesScreenContainer from "../Games/GamesScreenContainer";

// SOCKET WILL BE IN THIS CLASS.. I GUESS?

const cookies = new Cookies();
let uname = "null";
let uloc = -1;
let isAdmin = false;
class GameLobby extends Component {

    constructor(props) {
        super(props);
        console.log("GameRoomID: ", props.gameDetails.gameRoomID, " user List: ", props.gameDetails.users);
        uname = cookies.get(props.gameDetails.gameRoomID+"uname");
        if (cookies.get("adminKey") != null) isAdmin = true;
        this.state = {
            gameRoomDetails: this.props.gameDetails,
            amIReady: false,
            users: props.gameDetails.users
        };
    }


    componentWillReceiveProps(nextProps) {
        console.log("Değiştik", nextProps);
        let aState = {
            gameRoomDetails: nextProps.gameDetails,
            users: nextProps.gameDetails.users
        };
        this.setState(aState);

        // You don't have to do this check first, but it can help prevent an unneeded render
        //if (nextProps.startTime !== this.state.startTime) {
        //    this.setState({ startTime: nextProps.startTime });
        //}

    }



    changeReadyStatus(){

        for (let i = 0; i < (this.state.gameRoomDetails.users).length; i++){
            if (uname.toUpperCase() === (this.state.gameRoomDetails.users)[i].username) {
                uloc = i;
                break;
            }
        }

        console.log("uloc is ", uloc, " uname is ", uname);

        if (this.state.gameRoomDetails != null) {
            let tmpHolder = false;
            let userObj = (this.state.gameRoomDetails.users)[uloc];
            if (userObj.ready) {
                tmpHolder = false;
            } else {
                tmpHolder = true;
            }
            this.props.userReady(uname.toUpperCase(), tmpHolder, this.state.gameRoomDetails.gameRoomID);
        }
    }

    adminSayYes() {
        this.props.adminDecision(this.state.gameRoomDetails.gameRoomID, true);
    }
    adminSayNo() {
        this.props.adminDecision(this.state.gameRoomDetails.gameRoomID, false);
        this.exitGame()
    }
    startGameBinder() {
        this.props.startGame(this.state.gameRoomDetails.gameRoomID);
    }

    exitGame() {
        this.props.exitGame(this.props.gameDetails.gameRoomID,uname)
    }

    render() {
        let customStyle = { backgroundImage: "url(" + Lobby + ")",
            backgroundSize: "cover",
            backgroundRepeat:   "no-repeat",
            backgroundPosition: "center center"    };

        console.log("IM HERE");
        console.log(this.state.gameRoomDetails);
        let gameRoomUsers = this.state.gameRoomDetails.users;

        let listAdder = gameRoomUsers.map( (user,i) => {
            return <div key={i}> <div className="row">
                <div className="col"> {user.username} </div> <div className="col">
                <div hidden={user.username !== uname.toUpperCase() }>
                <label hidden={!user.ready}> <img onClick={this.changeReadyStatus.bind(this)} src={ CheckedU } /> </label>
                <label hidden={user.ready}> <img onClick={this.changeReadyStatus.bind(this)} src={ UncheckedU } /> </label>
                </div>
                <div hidden={user.username === uname.toUpperCase() }>
                <label hidden={!user.ready}> <img src={ Checked } /> </label>
                <label hidden={user.ready}> <img src={ Unchecked } /> </label>
                </div>
            </div> </div>
            </div>
        } );

        let buttonAdder = null;
        if (isAdmin) {
            let shouldGoOn = true;
            for(let k = 0 ; k< gameRoomUsers.length; k++) {
                if(!gameRoomUsers[k].ready) shouldGoOn = false
            }
            if (shouldGoOn) buttonAdder = <a className="btn btn-warning" onClick={this.startGameBinder.bind(this) }> Start Game</a>;
        }

        if (this.state.gameRoomDetails.active) {
            let buttonAdderForAdminReis;
            if (isAdmin) {
                buttonAdderForAdminReis =  <button onClick={this.exitGame.bind(this)}>Exit game</button>;

                if (this.props.gameStatus.isDecided) {
                  return(
                      <div> Beklemeyi seçenler bekleyecekler </div>
                  );
                }

                if (this.props.gameStatus.isWaiting) {
                    return(
                        <div> <p> Bekleyek mi? </p> <br/> <button onClick={this.adminSayYes.bind(this)}> YEP </button>  <button onClick={this.adminSayNo.bind(this)}> NO </button> </div>
                    );
                }
            } else {
                buttonAdderForAdminReis = <span></span>;

                if (this.props.gameStatus.isWaiting) {
                    if (this.props.gameStatus.isDecided) {
                        return (
                            <div> Beklemeyi seçenler bekleyecekler </div>
                        );
                    }

                    if (this.props.gameStatus.weAreGoing) {
                        return (<div> Admin gg. birkaç saniye sonra kaçayruz =)</div>);
                    } else {
                        return (
                            <div> {this.props.gameStatus.downPlayer} kardeşimiz düştü. Beklemenin icap edip etmediğine
                                admin Reis karar verecek. Beklemede kalın. </div>);
                    }
                }
            }
            return (<div>
                        <header className="pandoraHeader">
                            <h1 className="App-title">Welcome to Pandora</h1>
                            { buttonAdderForAdminReis }
                        </header>
                        <GamesScreenContainer selectedGame="DummyName" gameID={this.state.gameRoomDetails.gameID} gameRoomID={this.state.gameRoomDetails.gameRoomID} users={this.state.users}/>
                    </div>);
        } else
            {
                return (
        <div className="page-header page-lobby">
            <div className="page-header-image" style={customStyle}/>
            <div className="container">
                <h1 className="welcome-message">Game Lobby</h1>
                <div className="col-md-4 content-center gameLobbyCont">
                    <div className="gameContainer">
                        {listAdder}
                    </div>
                    {buttonAdder}
                </div>
            </div>
        </div>
    );
}
    }
}

export default GameLobby;
