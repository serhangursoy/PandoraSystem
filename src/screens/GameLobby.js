import React, { Component } from 'react';
import Lobby from '../image/gamelobby.gif';
import {games} from "../Games/games";

class GameLobby extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameRoomDetails: this.props.gameDetails,
            amIReady: false
        }
    }

    changeReadyStatus(){
            let tmpState = this.state;
            if (this.state.amIReady != "ready") {
                tmpState.amIReady = "not ready";
            } else {
                tmpState.amIReady = "ready";
            }
            this.props.userReady(this.state.gameRoomDetails.username, tmpState.amIReady, this.state.gameRoomDetails.gameID);
    }

    render() {
        let customStyle = { backgroundImage: "url(" + Lobby + ")",
            backgroundSize: "cover",
            backgroundRepeat:   "no-repeat",
            backgroundPosition: "center center"    };


        let gameRoomUsers = this.state.gameRoomDetails.users;

        console.log(this.state.gameRoomDetails);
        let listAdder = gameRoomUsers.map( (user,i) => {
            if (user.connID == this.state.gameRoomDetails.ourConnID && this.state.gameRoomDetails.isAdmin == false) {
            return <div key={user.connID}> {user.username} <div className="aa"><input id="checkbox1" type="checkbox" onClick={this.changeReadyStatus()}/>
            <label>READY</label></div> </div>} else {
                return <div key={user.connID}> {user.username} <div className="aa">
                    <label>READY</label></div> </div>
            }
        } );

        let buttonAdder = null;
        if (this.state.gameRoomDetails.isAdmin) {
            buttonAdder = <a className="btn btn-warning" onClick={this.props.dummyClicked}> Start Game</a>;
        }

        return (

            <div className="page-header page-lobby">
                <div className="page-header-image" style={customStyle}></div>
                <div className="container">
                    <h1 className="welcome-message">Game Lobby</h1>
                    <div className="col-md-4 content-center">
                        <div className="gameContainer">
                            { listAdder }
                        </div>
                        { buttonAdder }
                    </div>
                </div>
            </div>

        );
    }
}

export default GameLobby;
