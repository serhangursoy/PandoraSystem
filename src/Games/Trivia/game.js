import React from 'react';
import './style.css';
import GameWrapperRedux from "../GameWrapper";
import questions from './questions.json';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
// role 0 -> Red Team
// role 1 -> Blue Team
// round 0 -> Category Pick for Blue
// round 1 -> Question for Red
// round 2 -> Category Pick for Red
// round 3 -> Question for Blue
// 5 questions for each team
// 4 multiple choices per question
// Current DB -> 5 Hist, 19 Sport, 30 Gen. Know.

let username;
let userID;
let pickedTeam;
let playerPhase;

export default class GameContainer extends GameWrapperRedux {
    constructor(props) {
        super(props);
        username = cookies.get(this.props.gameRoomID + "uname").toUpperCase();
        // let rnd = cookies.get('roundNum'); // state.roundNumber = rnd;
        let playerTeams = [];
        let selectedAnswers = [];
        for(let i = 0; i<props.users.length; i++){
            playerTeams.push(-1);
        }
        for(let i=0; i<5; i++){
            selectedAnswers.push(-1);
        }

        this.state.game = {
            playerNo: props.users.length,
            bluePlayerNo: 0,
            redPlayerNo: 0,
            playerTeams: playerTeams,
            roundNumber: 0,
            selectedCtgry: -1,  // index of selected category
            selectedAnswer: selectedAnswers, // array of indices of selected answers
            solutionKey: [],    // array of correct answer indices
            catReadyPlayers: [],
            ansReadyPlayers: [],
            questions: [],
            turnQuestion: 0,    // index of current question
            blueScore: 0,
            redScore: 0,
            winner: -1,
        };

        playerPhase = 0;
        pickedTeam = -1;
        this.teams = [0, 1];

        for(let i = 0; i < props.users.length; i++) {
            if(props.users[i].username === username) {
                userID = i;
                break;
            }
        }
    }

    // Pick Team
    renderTeamPick() {
        return (
            <div className="team-options">
                <h3 className="welcomeMsg">Welcome to Trivia Game!</h3>
                <h3 className="pickTeamMsg">Please pick a team:</h3>
                <Option value={this.teams[0]} onClick={() => this.pickTeam(this.teams[0])}/>
                <Option value={this.teams[1]} onClick={() => this.pickTeam(this.teams[1])}/>
            </div>
        )
    }
    renderWaitPlayers() {
        return (
            <div className="waitPlayer">
                <img src={ require('./clock.png') } alt="Waiting.."/>
                <h2 className="pickedTeamInfo">You picked {pickedTeam}!</h2>
                <h3>Waiting for other players to pick a team...</h3>
                <button onClick={() => this.changeTeam()}>Change Team</button>
            </div>
        )
    }
    pickTeam(team) {
        let state = this.state.game;

        pickedTeam = team;
        state.playerTeams[userID] = team;
        playerPhase = 1;

        if(state.playerTeams.indexOf(-1) === -1 ) { // All players picked a team
            state.phase = 1;
            let red = 0;
            let blue = 0;

            for(let i=0; i<state.playerNo; i++){
                if(state.playerTeams[i] === 0){
                    red++;
                }
                if(state.playerTeams[i] === 1){
                    blue++;
                }
            }
            //console.log(state.playerTeams);
            state.bluePlayerNo = blue;
            state.redPlayerNo = red;
        }

        this.setState(state);
    }
    changeTeam() {
        let state = this.state.game;

        pickedTeam = -1;
        state.playerTeams[userID] = -1;
        playerPhase = 0;

        this.setState(state);
    }

    // Game Info
    renderInfoMsg() {
        let color;
        let turn = this.state.game.roundNumber;
        let rnd = this.state.game.roundNumber % 4;
        let role = this.state.game.playerTeams[userID];
        let qTurn = this.state.game.turnQuestion;
        let bScore = this.state.game.blueScore;
        let rScore = this.state.game.redScore;

        if(rnd === 0 || rnd === 3)
            color = "blue";
        else
            color = "red";

        return (
            <InfoMsg role={role} turn={turn} color={color} qTurn={qTurn} bScore={bScore} rScore={rScore}/>
        )
    }

    //GamePlay
    renderGamePhase(){
        let role = this.state.game.playerTeams[userID];
        let rnd = this.state.game.roundNumber % 4;

        if(rnd === 0){ // Red Team, blue pick category
            if(role === 0){
                return (
                    <div>
                        <div className="turn-info">{this.renderInfoMsg()}</div>
                        <h2 className="redWaitMsg">Waiting for Blue Team to pick a category..</h2>
                    </div>
                )
            } else {
                return (
                    <div>
                        <div className="turn-info">{this.renderInfoMsg()}</div>
                        <div className="categoriesDiv">
                            <button className={"categoryBtn " + this.showSelected(0)} onClick={() => this.categorySelect(0)}>History</button>
                            <button className={"categoryBtn " + this.showSelected(1)} onClick={() => this.categorySelect(1)}>Sports</button>
                            <button className={"categoryBtn " + this.showSelected(2)} onClick={() => this.categorySelect(2)}>General Knowledge</button>
                        </div>
                        {this.renderReadyBtn()}
                    </div>
                )
            }
        } else if(rnd === 1){
            if(role === 0){
                return (
                    <div>
                        <div className="turn-info">{this.renderInfoMsg()}</div>
                        {this.renderQuestion()}
                        {this.renderAnsReadyBtn()}
                    </div>
                )
            } else {
                return (
                    <div>
                        <div className="turn-info">{this.renderInfoMsg()}</div>
                        {this.renderQuestion()}
                    </div>
                )
            }
        } else if(rnd === 2) {
            if(role === 1){
                return (
                    <div>
                        <div className="turn-info">{this.renderInfoMsg()}</div>
                        <h2 className="redWaitMsg">Waiting for Red Team to pick a category..</h2>
                    </div>
                )
            } else {
                return (
                    <div>
                        <div className="turn-info">{this.renderInfoMsg()}</div>
                        <div className="categoriesDiv">
                            <button className={"categoryBtn " + this.showSelected(0)} onClick={() => this.categorySelect(0)}>History</button>
                            <button className={"categoryBtn " + this.showSelected(1)} onClick={() => this.categorySelect(1)}>Sports</button>
                            <button className={"categoryBtn " + this.showSelected(2)} onClick={() => this.categorySelect(2)}>General Knowledge</button>
                        </div>
                        {this.renderReadyBtn()}
                    </div>
                )
            }
        } else {
            if(role === 1){
                return (
                    <div>
                        <div className="turn-info">{this.renderInfoMsg()}</div>
                        {this.renderQuestion()}
                        {this.renderAnsReadyBtn()}
                    </div>
                )
            } else {
                return (
                    <div>
                        <div className="turn-info">{this.renderInfoMsg()}</div>
                        {this.renderQuestion()}
                    </div>
                )
            }
        }

    }

    showChecked(ind) {
        let qTurn = this.state.game.turnQuestion;

        if(this.state.game.selectedAnswer[qTurn] === ind)
            return "checked";
    }

    checkAnswer(ind) {
        let state = this.state.game;
        let qTurn = state.turnQuestion;

        state.selectedAnswer[qTurn] = ind;

        this.setState(state);
    }

    renderQuestion(){
        let qTurn = this.state.game.turnQuestion;
        let questions = this.state.game.questions;
        let rnd = this.state.game.roundNumber % 4;
        let role = this.state.game.playerTeams[userID];

        if(rnd === 1){
            if(role === 0){
                return (
                    <div className="questionDiv">
                        <h2 className="questionTxt">{questions[qTurn].question}</h2>
                        <label class="answer">{questions[qTurn].answers[0]}
                            <input type="radio" onClick={() => this.checkAnswer(0)} checked={this.showChecked(0)} name="radio"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[1]}
                            <input type="radio" onClick={() => this.checkAnswer(1)} checked={this.showChecked(1)} name="radio"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[2]}
                            <input type="radio" onClick={() => this.checkAnswer(2)} checked={this.showChecked(2)} name="radio"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[3]}
                            <input type="radio" onClick={() => this.checkAnswer(3)} checked={this.showChecked(3)} name="radio"/>
                            <span class="checkmark"></span>
                        </label>
                    </div>
                )
            } else {
                return (
                    <div className="questionDiv">
                        <h2 className="questionTxt">{questions[qTurn].question}</h2>
                        <label class="answer">{questions[qTurn].answers[0]}
                            <input type="radio" checked={this.showChecked(0)} name="radio" disabled="disabled"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[1]}
                            <input type="radio" checked={this.showChecked(1)} name="radio" disabled="disabled"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[2]}
                            <input type="radio" checked={this.showChecked(2)} name="radio" disabled="disabled"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[3]}
                            <input type="radio" checked={this.showChecked(3)} name="radio" disabled="disabled"/>
                            <span class="checkmark"></span>
                        </label>
                    </div>
                )
            }
        } else {
            if(role === 1){
                return (
                    <div className="questionDiv">
                        <h2 className="questionTxt">{questions[qTurn].question}</h2>
                        <label class="answer">{questions[qTurn].answers[0]}
                            <input type="radio" onClick={() => this.checkAnswer(0)} checked={this.showChecked(0)} name="radio"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[1]}
                            <input type="radio" onClick={() => this.checkAnswer(1)} checked={this.showChecked(1)} name="radio"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[2]}
                            <input type="radio" onClick={() => this.checkAnswer(2)} checked={this.showChecked(2)} name="radio"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[3]}
                            <input type="radio" onClick={() => this.checkAnswer(3)} checked={this.showChecked(3)} name="radio"/>
                            <span class="checkmark"></span>
                        </label>
                    </div>
                )
            } else {
                return (
                    <div className="questionDiv">
                        <h2 className="questionTxt">{questions[qTurn].question}</h2>
                        <label class="answer">{questions[qTurn].answers[0]}
                            <input type="radio" checked={this.showChecked(0)} name="radio" disabled="disabled"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[1]}
                            <input type="radio" checked={this.showChecked(1)} name="radio" disabled="disabled"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[2]}
                            <input type="radio" checked={this.showChecked(2)} name="radio" disabled="disabled"/>
                            <span class="checkmark"></span>
                        </label>
                        <label class="answer">{questions[qTurn].answers[3]}
                            <input type="radio" checked={this.showChecked(3)} name="radio" disabled="disabled"/>
                            <span class="checkmark"></span>
                        </label>
                    </div>
                )
            }
        }
    }

    renderAnsReadyBtn(){
        let state = this.state.game;
        let element;

        if(state.ansReadyPlayers.indexOf(userID) === -1){
            element = <button className="ansReadyBtn" onClick={() => this.answerReady()}>Ready</button>;
        } else {
            element = <button className="ansReadyBtn" onClick={() => this.answerNotReady()}>Not Ready</button>
        }

        return element;
    }

    answerReady() {
        let state = this.state.game;
        let rnd = state.roundNumber % 4;
        let bNo = state.bluePlayerNo;
        let rNo = state.redPlayerNo;

        if(rnd === 3){
            state.ansReadyPlayers.push(userID);
            if(state.ansReadyPlayers.length === bNo){
                state.ansReadyPlayers = [];
                state.blueScore = state.blueScore + this.calculateScore();
                state.turnQuestion = state.turnQuestion + 1;
            }
        } else if(rnd === 1){
            state.ansReadyPlayers.push(userID);
            if(state.ansReadyPlayers.length === rNo){
                state.ansReadyPlayers = [];
                state.redScore = state.redScore + this.calculateScore();
                state.turnQuestion = state.turnQuestion + 1;
            }
        }

        if(state.turnQuestion === 5){ //Round changed
            let selectedAns = [];
            for(let i=0; i<5; i++){
                selectedAns.push(-1);
            }
            state.selectedAnswer = selectedAns;
            state.catReadyPlayers = [];
            state.roundNumber = state.roundNumber + 1;
            state.turnQuestion = 0;
            state.selectedCtgry = -1;
            state.solutionKey = [];
        }

        if(state.roundNumber === 8){ // When the game reach to an end
            state.phase = state.phase+1;
            if(state.redScore > state.blueScore){
                state.winner = 0;
            }
            else if(state.redScore < state.blueScore){
                state.winner = 1;
            }
            else{
                state.winner = 2;
            }
        }


        this.setState(state);
    }

    calculateScore() {
        let state = this.state.game;
        let score = 0;
        console.log("crtans: ", state.questions[state.turnQuestion].correct_answer);
        console.log("selectedans: ", state.selectedAnswer[state.turnQuestion]);
        if(state.questions[state.turnQuestion].correct_answer === state.selectedAnswer[state.turnQuestion]){
            score += 10;
        }

        return score;
    }

    answerNotReady() {
        let state = this.state.game;

        let ind = state.ansReadyPlayers.indexOf(userID);
        state.ansReadyPlayers.splice(ind, 1);

        this.setState(state);
    }

    renderReadyBtn() {
        let state = this.state.game;
        let element;

        if(state.catReadyPlayers.indexOf(userID) === -1){
            element = <button className="catReadyBtn" onClick={() => this.categoryReady()}>Ready</button>;
        } else {
            element = <button className="catReadyBtn" onClick={() => this.categoryNotReady()}>Not Ready</button>
        }

        return element;
    }

    showSelected(ind){
        let state = this.state.game;

        if(state.selectedCtgry === ind){
            return "selected";
        }
    }

    categorySelect(ind){
        let state = this.state.game;

        state.selectedCtgry = ind;

        this.setState(state);
    }

    categoryReady(){
        let state = this.state.game;
        let rnd = state.roundNumber % 4;
        let bNo = state.bluePlayerNo;
        let rNo = state.redPlayerNo;

        state.questions = [];

        if(rnd === 0){
            state.catReadyPlayers.push(userID);
            if(state.catReadyPlayers.length === bNo){
                state.roundNumber = state.roundNumber + 1;
                state.questions = this.pickQuestions(state.selectedCtgry);
            }
        } else if(rnd === 2){
            state.catReadyPlayers.push(userID);
            if(state.catReadyPlayers.length === rNo){
                state.roundNumber = state.roundNumber + 1;
                state.questions = this.pickQuestions(state.selectedCtgry);
                console.log("state q:", state.questions);
            }
        }

        this.setState(state);
    }

    categoryNotReady(){
        let state = this.state.game;

        let ind = state.catReadyPlayers.indexOf(userID);
        state.catReadyPlayers.splice(ind, 1);

        this.setState(state);
    }

    pickQuestions(ind){
        let q = [];
        let sol = [];
        let indices = [];
        let random;

        for(let i=0; i<5; i++){
            random = Math.floor(Math.random() * 5); // 5 -> 10, 20, 30 olacak daha sonra
            if(indices.indexOf(random) !== -1)
                i--;
            else
                indices.push(random);
        }
        //console.log("indices: ", indices);
        for(let i=0; i<5; i++){
            if(ind === 0)
                q.push(questions.categories[ind].History[indices[i]]);
            else if(ind === 1)
                q.push(questions.categories[ind].Sports[indices[i]]);
            else if(ind === 2)
                q.push(questions.categories[ind].General_Knowledge[indices[i]]);
        }
        //console.log("q: ", q);

        return q;
    }

    renderFinalPhase(){
        let winner = this.state.game.winner;
        if(winner === 0){
            return (
                <div className="lastDiv">
                    <img src={ require('./gameover.png') } alt="Game Over!"/>
                    <h2 className="winnerInfoTxt">Red Team won!</h2>
                </div>
            )
        } else {
            return (
                <div className="lastDiv">
                    <img src={ require('./gameover.png') } alt="Game Over!"/>
                    <h2 className="winnerInfoTxt">Blue Team won!</h2>
                </div>
            )
        }
    }
    render(){
        let element;

        if(playerPhase === 0){
            element = this.renderTeamPick();
        } else if(this.state.game.phase === 1){
            element = this.renderGamePhase();
        } else if(this.state.game.phase === 2){
            element = this.renderFinalPhase();
        } else if(playerPhase === 1) {
            element = this.renderWaitPlayers();
        }
        return (
            <div>
                {element}
            </div>
        );
    }
}

class InfoMsg extends React.Component {
    setClass() {
        return "infoMsg " + this.props.color;
    }
    setTeamClass() {
        let team = this.props.role;
        if(team === 0)
            return "infoTmMsg redTm";
        else
            return "infoTmMsg blueTm";
    }
    setTurn() {
        let turn = this.props.turn % 4;
        if(turn === 0){
            return "Blue Team picks category";
        } else if(turn === 1) {
            return "Red Team's turn";
        } else if(turn === 2) {
            return "Red Team picks category";
        } else{
            return "Blue Team's turn";
        }
    }
    setTeamTxt() {
        if(this.props.role === 0){
            return "Your team is Red";
        } else {
            return "Your team is Blue";
        }
    }
    render() {
        let turn = this.props.turn % 4;
        let rnd = Math.ceil(this.props.turn / 4);
        let qNo = this.props.qTurn+1;

        if(turn === 1 || turn === 3){
            return (
                <div>
                    <div className={this.setClass()}>
                        <span className="turnMsg">{this.setTurn()}</span>
                    </div>
                    <div className={this.setTeamClass()}>
                        <span>{this.setTeamTxt()}</span>
                    </div>
                    <div className="qInfoDiv">
                        <span className="rndNoTxt">Round: {rnd} </span>
                        <span className="qNoTxt">Question: {qNo}/5</span>
                        <span className="bScoreTxt">Blue's Score: {this.props.bScore}</span>
                        <span className="rScoreTxt">Red's Score: {this.props.rScore}</span>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className={this.setClass()}>
                        <span className="turnMsg">{this.setTurn()}</span>
                    </div>
                    <div className={this.setTeamClass()}>
                        <span>{this.setTeamTxt()}</span>
                    </div>
                </div>
            );
        }

    }
}

class Option extends React.Component {
    setTeam() {
        let team;
        let teamColor;

        if(this.props.value === 0){
            team = "Team Red";
            teamColor = "red";
        }

        if(this.props.value === 1){
            team = "Team Blue";
            teamColor = "blue";
        }

        return {
            "teamColor": teamColor,
            "team": team
        };
    }

    render() {
        return (
            <button className={this.setTeam().teamColor} onClick={this.props.onClick}>
                {this.setTeam().team}
            </button>
        );
    }
}