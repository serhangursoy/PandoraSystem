

import React from "react"
import GameWrapperRedux from "../GameWrapper";
import "./style.css"
import Cookies from "universal-cookie";

let username;
let yourID;
let youWillCheck;
const cookies = new Cookies();

export default class GameContainer extends GameWrapperRedux {
    constructor(props) {
        super(props);
        username = cookies.get(this.props.gameRoomID + "uname").toUpperCase();

        let arr = [];
        for (let k = 0; k < props.users.length; k++)
        {
            arr[k] = -1;
        }

        this.state.game = {
                "ID": props.gameRoomID,
                "nameArray" : arr,     // Names that left one implicated
                "turn": 0,   // Who's turn
                "users": props.users
        };

        for(let i = 0; i < props.users.length; i++) {
            if (props.users[i].username === username) {
                yourID = i;
                break;
            }
        }

        if (yourID+1 !== props.users.length) {
            youWillCheck = yourID + 1;
        } else {
            youWillCheck = 0;
        }
    }

    areWeAllDone() {

        console.log("Toplamda ", this.props.users.length, " user var. Liste böyle ", this.props.users);
        for (let i = 0; i < this.props.users.length; i++) {
            if ( this.state.game.nameArray[i] === -1)
                return false;
        }

        return true;
    }

    didYouWrote(){
        if ( this.state.game.nameArray[youWillCheck] !== -1)
            return true;
        else
            return false;
    }

    submitName() {
        let nameYouTyped = this.refs[yourID].value;
        let tmpState = this.state.game;
        tmpState.nameArray[youWillCheck] = nameYouTyped;
        this.setState(tmpState);
    }

    changeTurn() {
        let tmpState = this.state.game;
        if (this.state.game.turn + 1 !== tmpState.users.length)
            tmpState.turn += 1;
        else
            tmpState.turn = 0;
        this.setState(tmpState);
    }

    render() {
        let card;

        if (!this.areWeAllDone()) {
            if (!this.didYouWrote()) {
                card = <div><p> You are writing for {this.props.users[youWillCheck].username} </p>
                    <textarea ref={yourID}> </textarea>
                    <div className="exbtn truthbutton" onClick={this.submitName.bind(this)}>DONE</div>
                </div>;
            } else {
                card = <div><p> You are writing for {this.props.users[youWillCheck].username} and typed { this.state.game.nameArray[youWillCheck] }. Waiting for others to finish.. </p></div>;
            }
        } else {
            if (this.state.game.turn === yourID) {
                card = <div><p> ??? -- Guess </p></div>;
            } else if ( this.state.game.turn === youWillCheck) {
                card = <div><p>  {this.props.users[this.state.game.turn].username} is now {this.state.game.nameArray[this.state.game.turn]}. Press the button if he gets no. </p>
                    <div className="exbtn darebutton" onClick={this.changeTurn.bind(this)}> Continue </div>
                </div>;
            } else {
                card = <div><p>  {this.props.users[this.state.game.turn].username} is now {this.state.game.nameArray[this.state.game.turn]} </p>
                </div>;
            }
        }

        return(
            card
        )
    }
}


