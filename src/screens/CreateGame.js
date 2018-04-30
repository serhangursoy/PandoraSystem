import React, { Component } from 'react';
import Background from '../image/multipurpose.gif';
import {games} from '../Games/games.js';

import Modal from 'react-responsive-modal';

class CreateGame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clickedGameID: null,
            username: null,
            ModalHandler: {
                nameModal: {
                    open: false
                }
            }
        }
    }


    openPopupModal(gameID){
        let stateInit = this.state;
        stateInit.clickedGameID = gameID;
        stateInit.ModalHandler.nameModal.open = true;
        this.setState(stateInit);
    }


    usernameChange( e ) {
        let tmpState = this.state;
        tmpState.username = e.target.value;
        this.setState(tmpState);
    }

    localHandler() {
        let uName = this.state.username;
        if(uName != null) {
            let isOkay =  this.props.createGameClicked(this.state.clickedGameID,uName);
            if(!isOkay) {
                // this.openErrorModal();
            }
        }
    }


    closePopupModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.nameModal.open = false;
        this.setState(stateInit);
    }


    render() {
        let customStyle = { backgroundImage: "url(" + Background + ")" };
        let listAdder = games.map( (game, i) =>

                <div key={i} className="card gameCard">
                        <div className="header text-center">
                            <h4 className="title title-up">{game.name}</h4>
                            <a className="btn btn-success btn-round" onClick={this.openPopupModal.bind(this, games[i].id)}>Create</a>
                        </div>
                </div>
        );
        return (

            <div>
            <div className="page-header">
                <div className="page-header-image" style={customStyle}></div>
                <div className="container">
                        <h5 className="adaptiveTitle">New Game</h5>
                        <div className="col-md-4 content-center gamePickerPanel">
                            <div className="gameContainer">
                                { listAdder }
                            </div>
                        </div>
                    <div className="backButtonStable">
                        <a className="btn btn-warning" onClick={this.props.goBack}> Return to Menu </a>
                    </div>
                </div>
            </div>
                <Modal open={this.state.ModalHandler.nameModal.open} onClose={this.closePopupModal.bind(this)}>
                    <div className="modal-body">
                        <input type="text" className="form-control" placeholder="Username" onChange={this.usernameChange.bind(this)}/>
                    </div>
                    <div>
                        <a className="btn btn-success btn-round btn-lg btn-block" onClick={this.localHandler.bind(this)}>Done</a>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default CreateGame;
