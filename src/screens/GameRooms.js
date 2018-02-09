import React, { Component } from 'react';
import GameBack from '../image/roomnew.gif'//'../image/gamerooms.gif';

class GameRooms extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let customStyle = { backgroundImage: "url(" + GameBack + ")",
            backgroundSize: "cover",
            backgroundRepeat:   "no-repeat",
            backgroundPosition: "center center"    };

        return (

            <div className="page-header page-lobby">
                <div className="page-header-image" style={customStyle}></div>
                <div className="container">
                    <h1 className="welcome-message">Game Rooms</h1>
                    <div className="col-md-4 content-center">
                        <div className="gameContainer">
                            <div className="">Çifçi Köylü Oyunu Connection: 8</div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default GameRooms;
