import React, { Component } from 'react';
import Background from '../image/multipurpose.gif';

class CreateGame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clickedGame: null
        }
    }

    getGames() {
        return [
            {
                id: 1,
                name: "Çifçi Köylü",
                thumbnail: null
            },
            {
                id: 2,
                name: "Makas oyunu",
                thumbnail: null
            }
        ]
    }

    localGameClicked(gameID) {
        this.props.createGameClicked(gameID);
    }

    render() {
        let customStyle = { backgroundImage: "url(" + Background + ")" };
        let gameList = this.getGames();
        let listAdder = gameList.map( (game) =>
            <div key={game.id} className="card gameCard">
                    <div className="header text-center">
                        <h4 className="title title-up">{game.name}</h4>
                        <a className="btn btn-success btn-round" onClick={this.localGameClicked.bind(this, game.id)}>Create</a>
                    </div>
            </div>
        );
        return (
            <div className="page-header">
                <div className="page-header-image" style={customStyle}></div>
                <div className="container">
                    <div className="content-center">
                        <h5 className="adaptiveTitle">New Game</h5>
                        <div className="gameContainer">
                            { listAdder }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateGame;
