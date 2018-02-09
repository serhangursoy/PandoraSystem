import React, { Component } from 'react';
import Lobby from '../image/gamelobby.gif';

class GameLobby extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let customStyle = { backgroundImage: "url(" + Lobby + ")",
        backgroundSize: "cover",
        backgroundRepeat:   "no-repeat",
        backgroundPosition: "center center"    };

        return (

            <div className="page-header page-lobby">
                <div className="page-header-image" style={customStyle}></div>
                <div className="container">
                    <h1 className="welcome-message">Game Lobby</h1>
                    <div className="col-md-4 content-center">
                        <div className="gameContainer">
                            <div> Serhan <div className="checkbox"><input id="checkbox1" type="checkbox"/><label>READY</label></div> </div>
                            <div> Taner <div className="checkbox"><input id="checkbox1" type="checkbox"/><label>READY</label></div></div>
                            <div> Berfu <div className="checkbox"><input id="checkbox1" type="checkbox"/><label>READY</label></div></div>
                            <div> Armağan <div className="checkbox"><input id="checkbox1" type="checkbox"/><label>READY</label></div></div>
                            <div> Ege <div className="checkbox"><input id="checkbox1" type="checkbox"/><label>READY</label></div></div>
                        </div>
                        <a className="btn btn-warning" onClick={this.props.dummyClicked}> Start Game</a>
                    </div>
                </div>
            </div>

        );
    }
}

export default GameLobby;
