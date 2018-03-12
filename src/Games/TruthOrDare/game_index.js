

import React from "react"
import GameWrapperRedux from "../GameWrapper";
import "./style.css"
import Cookies from "universal-cookie";

let username;

const cookies = new Cookies();

export default class GameContainer extends GameWrapperRedux {
    constructor(props) {
        super(props);
        username = cookies.get(this.props.gameRoomID + "uname").toUpperCase();

        this.state = {
            "ID": props.gameRoomID,
            "asking" : 0,     // Player no
            "answering": 1,   // Player no
            "answered": -1,   // 0 == Truth , 1 == Dare
            "users": props.users
        };

       // this.spin();
    }


    spin() {
        let currState = this.state;
        const min = 1;
        const max = (this.props.users).length;
        const rand1 = (min + Math.random() * (max - min)).toFixed() - 1;
        let rand2 = (min + Math.random() * (max - min)).toFixed() - 1;
        while(rand1 === rand2 ) rand2 =  (min + Math.random() * (max - min)).toFixed() - 1;
        currState.answering = rand1;
        currState.asking = rand2;
        currState.answered = -1;
        console.log("Asking : ", rand2, " Answering: ", rand1);
        console.log("Names: ", this.props.users[rand2].username, " and " , this.props.users[rand1].username);
        this.setState(currState);
    }

    // If no, just let them watch..
    amIPlaying(){
        console.log("Am I playing? ", username === this.props.users[this.state.asking].username || username === this.props.users[this.state.answering].username);
        if ( username === this.props.users[this.state.asking].username || username === this.props.users[this.state.answering].username)
            return true;
         else
            return false;
    }

    changePlayerChoic( ch ){
        var tmpState = this.state;
        if (ch) {
            tmpState.answered = 0;
        } else {
            tmpState.answered = 1;
        }
        this.setState(tmpState);
        this.render();
    }

    playingAsWho(){
        console.log("Im playing as  ", username === this.props.users[this.state.asking].username);
        if ( username === this.props.users[this.state.asking].username)
            return false;   // ASKING
        else
            return true;
    }

    whatIsTheFinalDecision(){
        if(this.state.answered === 0)
            return <div className="exbtn truthbutton">TRUTH</div>;
        else if (this.state.answered === 1)
            return <div className="exbtn darebutton">DARE</div>;
        else
            return <div className="exbtn waitingbutton"> STILL WAITING </div>;
    }

    render() {
        console.log("render called");
        let amI = this.amIPlaying();
        let answerOfPlayer = this.whatIsTheFinalDecision();
        let card;

        if (!amI) {
            card = <div className="mainContainer">
                <div><span>{this.props.users[this.state.answering].username } says .. </span></div>
                { answerOfPlayer }
            </div>
        } else {
            // If playing, playing as who?
            if (!this.playingAsWho()) { //If asking..
                console.log("Guys answer is ", this.state.answered);
                if ( this.state.answered === -1) {
                    console.log("Im waiting for that guy to answer");
                    card = <div className="mainContainer">
                        <div><span>{this.props.users[this.state.answering].username } still waiting.. </span></div>
                        { answerOfPlayer }
                    </div>
                }else {
                    console.log("Dude answered finally..");
                    card = <div className="mainContainer">
                        <div><span>{this.props.users[this.state.answering].username } says .. </span></div>
                        { answerOfPlayer }
                        <div className="exbtn spinbutton" onClick={this.spin.bind(this)}> Done, SPIN AGAIN! </div>
                    </div>
                }

            } else {
                if ( this.state.answered == -1) {
                    console.log("I have to answer");
                    card = <div className="mainContainer">
                        <div>
                            <span>{ this.props.users[this.state.answering].username } , your choice is ... </span>
                        </div>
                        <div className="exbtn truthbutton" onClick={this.changePlayerChoic.bind(this, true)}>TRUTH</div>
                        <div className="exbtn darebutton" onClick={this.changePlayerChoic.bind(this, false)}>DARE</div>
                    </div>
                }else {
                    console.log("I already answered...");
                    card = <div className="mainContainer">
                        <div><span>{this.props.users[this.state.answering].username }, your choice is .. </span></div>
                        { answerOfPlayer }
                    </div>
                }
            }

        }

        return(
            card
        )
    }
}


