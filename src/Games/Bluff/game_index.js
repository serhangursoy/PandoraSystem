

import React from "react"
import GameWrapperRedux from "../GameWrapper";
import "./style.css"
import Cookies from "universal-cookie";

import im1 from "./img/im1.jpeg";
import im2 from "./img/im2.jpeg";
import im3 from "./img/im3.jpeg";
import im4 from "./img/im4.jpg";
import im5 from "./img/im5.jpeg";
import im6 from "./img/im6.jpeg";
import im7 from "./img/im7.jpeg";
import im8 from "./img/im8.jpeg";
import im9 from "./img/im9.jpeg";
import im10 from "./img/im10.jpeg";
import im11 from "./img/im11.jpeg";
import im12 from "./img/im12.jpeg";
import im13 from "./img/im13.jpg";
import im14 from "./img/im14.jpeg";
import im15 from "./img/im15.jpeg";
import im16 from "./img/im16.jpeg";
import im17 from "./img/im17.jpeg";
import im18 from "./img/im18.jpeg";
import im19 from "./img/im19.jpeg";
import im20 from "./img/im20.jpeg";

let username;

let yourID;
let initScore;
let initAnswers;
let mySettedImg;
const cookies = new Cookies();

const allImages = [ im1, im2, im3, im4, im5, im6, im7, im8, im9, im10, im11, im12, im13, im14, im15, im16, im17, im18, im19, im20];


export default class GameContainer extends GameWrapperRedux {
    constructor(props) {
        super(props);
        username = cookies.get(this.props.gameRoomID + "uname").toUpperCase();

        initScore = [];
        initAnswers = [];
        for(let i = 0; i < props.users.length; i++) {
            if (props.users[i].username === username) {
                yourID = i;
            }

            initScore[i] = 0;
            initAnswers[i] = -1;
        }

        this.state.game = {
            "ID": props.gameRoomID,
            "speaking": 0,   // Player no
            "speakerAns": -1,
            "answered": initAnswers,   // 0 == Truth , 1 == Dare
            "scoreBoard": initScore,
            "users": props.users
        };


        console.log(this.state.game.speaking, "  speaker...");
    }


    whatIsMyID(){
        for(let i = 0; i < this.state.game.users.length; i++) {
            if (this.state.game.users[i].username === username) {
                return i;
            }
        }
    }

    wasTheFinalMove() {
        let currState = this.state.game;

        console.log("Okay, so was it final move? Speaker:", currState.speaking);
        for (let k = 0; k < currState.answered.length; k++) {
            if ( currState.answered[k] === -1 )
                if ( k !== currState.speaking )
                    return;
        }

        console.log("Yes we are all set..");
        // It seems everybody is fine! Let's distribute points and move on
        for (let k = 0; k < currState.users.length; k++) {
            if ( k !== currState.speaking ){
                console.log(currState.answered[k]," dude said and I'm ", k , " and all ", currState.answered, " and your ID is ", this.whatIsMyID(), " users" , currState.users, " and me ", username);
                if (currState.answered[k] === currState.speakerAns)
                    currState.scoreBoard[k] += 1;
                else
                    currState.scoreBoard[k] -= 1;
            }
        }
        this.spin();
    }

    spin() {
        let currState = this.state.game;
        let newSpeak = currState.speaking + 1;
        if (newSpeak === currState.users.length) newSpeak = 0;
        currState.speaking = newSpeak;
        currState.answered = initAnswers;
        currState.speakerAns = -1;
        this.setState(currState);
       // this.render();
    }

    decisionMe( dec ) {
        let tmpState = this.state.game;
        let myId = this.whatIsMyID();
        if (dec) {
            tmpState.answered[yourID] = 0;
        } else {
            tmpState.answered[yourID] = 1;
        }

        this.setState(tmpState);
        this.wasTheFinalMove();
       // this.render()
    }

    decisionSpeaker( ch ){
        var tmpState = this.state.game;
        if (ch) {
            tmpState.speakerAns = 0;
        } else {
            tmpState.speakerAns = 1;
        }
        this.setState(tmpState);
        // this.render();
    }

    playingAsWho(){
        if ( yourID !== this.state.game.speaking)
            return false;   // not speaking
        else
            return true;
    }

    getPlayerAnswer() {
        if (this.state.game.speakerAns === 1) {
            return "TRUTH"
        }
        return "BLUFF"
    }

    didIAnswered(){
        let myId = this.whatIsMyID();
        if (this.state.game.answered[yourID] !== -1)
            return true;
        else return false;
    }

    whatDoIThink(){
        let myId = this.whatIsMyID();
        if (this.state.game.answered[yourID] === 1)
            return " saying the truth..";
        else
            return " bluffing..";
    }


    getRandomImg() {
        const min = 1;
        const max = (allImages).length;
        const rand1 = (min + Math.random() * (max - min)).toFixed() - 1;
        mySettedImg = allImages[rand1];
        return   <img src={ allImages[rand1] } /> ;
    }

    getScoreBoard(){
        return  this.state.game.scoreBoard.map( (point,i) => {
            return <div key={i}> <div className="row">
                <div className="col"> { this.state.game.users[i].username } </div> <div className="col">
                Score: { point }
            </div> </div>
            </div>
        } );
    }

    render() {
        console.log("render called");
        let card;

        // Im the authority!
            if (!this.playingAsWho()) { //If not speaking..
                if ( this.state.game.speakerAns === -1) {
                    console.log("Im waiting for that guy to answer");
                    card = <div className="mainContainer">
                        <div><span>Waiting for  {this.props.users[this.state.game.speaking].username } to understand image.. </span></div>
                    </div>
                }else {

                    if (!this.didIAnswered()) {
                        console.log("Dude answered finally..");
                        card = <div className="mainContainer">
                            <div><span>Decide whether {this.props.users[this.state.game.speaking].username} is bluffing or not. <br/> I think... </span>
                            </div>
                            <div className="exbtn truthbutton" onClick={this.decisionMe.bind(this, true)}> TRUTH</div>
                            <div className="exbtn darebutton" onClick={this.decisionMe.bind(this, false)}> BLUFF</div>
                        </div>
                    } else {
                        card = <div className="mainContainer">
                            <div><span>You think {this.props.users[this.state.game.speaking].username} is { this.whatDoIThink() } </span>
                            </div>
                        </div>
                    }
                }

            } else {
                if ( this.state.game.speakerAns === -1) {
                    console.log("I have to answer");
                    card = <div className="mainContainer">
                        <div>
                         { this.getRandomImg() }
                            <span>{ this.props.users[this.state.game.speaking].username } , this is your card, pick one to do ... </span>
                        </div>
                        <div className="exbtn truthbutton" onClick={this.decisionSpeaker.bind(this, true)}> TRUTH </div>
                        <div className="exbtn darebutton" onClick={this.decisionSpeaker.bind(this, false)}> BLUFF </div>
                    </div>
                }else {
                    console.log("I already answered...");
                    card = <div className="mainContainer">
                        { <img src={ mySettedImg } /> }
                        <div><span>{this.props.users[this.state.game.speaking].username }, your choice is { this.getPlayerAnswer() } <br/> Let's see if you were convincing enough.. </span></div>
                    </div>
                }
            }


        return(
            <div> { this.getScoreBoard() }
                { card }
            </div>
        )
    }
}


