import React, { Component } from 'react';
import GameBack from '../image/hole.gif'//'../image/gamerooms.gif';
import {games} from '../Games/games.js';

import Modal from 'react-responsive-modal';


class GameRooms extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeGameRooms: props.gameRooms,
            username: "",
            IDGameRoom: 0,
            ModalHandler: {
                nameModal: {
                    open: false
                }
            }
        };
    }

    openPopupModal(gameRoom){
        let stateInit = this.state;
        stateInit.IDGameRoom = gameRoom;
        stateInit.ModalHandler.nameModal.open = true;
        this.setState(stateInit);
    }

    closePopupModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.nameModal.open = false;
        this.setState(stateInit);
    }


    passChange( e ) {
        let tmpState = this.state;
        tmpState.username = e.target.value;
        this.setState(tmpState);
    }

    localHandler() {
        let uName = this.state.username;
        if(uName != null) {
            let isOkay =  this.props.joinGameRoom(this.state.IDGameRoom,uName);
            if(!isOkay) {
               // this.openErrorModal();
            }
        }
    }

    findGameName(gameID){
        let name = {};
        games.forEach(function (game) {
            if(game.id == gameID) {
                console.log("found game name", game.name);
                name.name = game.name;
            }
        }, name)
        return name.name;
    }


    render() {
        let customStyle = { backgroundImage: "url(" + GameBack + ")",
            backgroundSize: "cover",
            backgroundRepeat:   "no-repeat",
            backgroundPosition: "center center"    };

        let allGameRooms = this.state.activeGameRooms;
        // console.log(allGameRooms);
        let listAdder;
        if (allGameRooms.length !== 0) {
            listAdder = allGameRooms.map((game, i) => <div className="card" key={i}>
                <img className="card-img-top" alt="Card image cap"/>
                <div className="card-body">
                    <h5 className="card-title">{this.findGameName(game.gameID)}</h5>
                    <p className="card-text">Game Room #{game.gameRoomID}</p>
                    <a onClick={this.openPopupModal.bind(this, game.gameRoomID)} className="btn btn-primary">Enter Game
                        Room</a>
                </div>
            </div>);
        } else {
           listAdder = <div className="">
                <a className="btn btn-warning"> No active game room found. Please wait until Admin creates a new game room. </a>
            </div>;
        }
        return (
            <div>
                <div className="page-header page-lobby">
                    <div className="page-header-image" style={customStyle}></div>
                    <div className="container">
                        <h1 className="welcome-message">Game Rooms</h1>
                        <div className="col-md-4 content-center gameLobbyCont">
                            <div className="gameContainer">
                                {listAdder}
                            </div>
                        </div>
                    </div>
                </div>

                <Modal open={this.state.ModalHandler.nameModal.open} onClose={this.closePopupModal.bind(this)}>
                    <div className="modal-body">
                        <input type="text" className="form-control" placeholder="Username" onChange={this.passChange.bind(this)}/>
                    </div>
                    <div>
                        <a className="btn btn-success btn-round btn-lg btn-block" onClick={this.localHandler.bind(this)}>Done</a>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default GameRooms;
