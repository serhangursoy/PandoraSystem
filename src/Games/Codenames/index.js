import React from 'react';
import './style.css';
import wordList from './wordList.json';
import GameWrapperRedux from "../GameWrapper";

import Cookies from 'universal-cookie';

const cookies = new Cookies();

function pickWords(cardNum) {
    let size = wordList.words.length;
    let words = [];
    let indices = [];

    for(let i=0; i<cardNum; i++){
        let random = Math.floor((Math.random() * size));
        if(indices.length === 0 || !indices.includes(random)){
            indices.push(random);
            words.push(wordList.words[random]);
        } else {
            i--;
        }
        // console.log(words[i]);
    }

    return words;
}

function generateKeyMap(cardNum) {
    let blueSize = 6;
    let redSize = 5;
    let civSize = 4;
    //let assSize = 1;

    let indices = [];
    let blues = [];
    let reds = [];
    let civ = [];
    let assassin;

    for(let i=0; i<cardNum; i++){
        let random = Math.floor((Math.random() * cardNum));

        if(indices.length === 0 || !indices.includes(random)){
            indices.push(random);
            if(i < blueSize){ // 6
                blues.push(random);
            } else if(i < blueSize + redSize){ // 11
                reds.push(random);
            } else if(i < blueSize + redSize + civSize){ // 15
                civ.push(random);
            } else {
                assassin = random;
            }
        } else {
            i--;
        }
    }

    return {
        "blues": blues,
        "reds": reds,
        "civ": civ,
        "assassin": assassin
    }
}

let username;
let userID;
let pickedTeam;
let playerPhase;

export default class GameContainer extends GameWrapperRedux {
    constructor(props) {
        super(props);
        let words = pickWords(16);
        let keyMap = generateKeyMap(16);
        username = cookies.get(this.props.gameRoomID + "uname").toUpperCase();
        // let rnd = cookies.get('roundNum'); // state.roundNumber = rnd;
        let playerTeams = [];
        for(let i = 0; i<props.users.length; i++){
            playerTeams.push(-1);
        }

        this.state.game = {
            playerNo: props.users.length,
            bluePlayerNo: 0,
            redPlayerNo: 0,
            revealedFields: [],
            playerTeams: playerTeams,
            roundNumber: 0,
            codenames: words,
            keymap: keyMap, // keyMap = JSON object of reds, blues, civ and assassin locations
            phase: 0,
            agentNo: 0,
            selectedAgents: [], // selected Agents by red or blue teams
            checkedPlayers: [],
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

    renderCards(i) {
        return (
            <Card kmap={this.state.game.keymap} rvldFields={this.state.game.revealedFields} slctAgents={this.state.game.selectedAgents} no={i} word={this.state.game.codenames[i].toUpperCase()} checkAgents={(i) => this.checkAgents(i)}/>
        )
    }

    renderGamePhase() {
        let role = this.state.game.playerTeams[userID];
        let rnd = this.state.game.roundNumber % 4;
        let element = this.state.game
        if(role === 1 && rnd === 1){ // Blue checkbox
            return (
                <div>
                    <div className="turn-info">{this.renderInfoMsg()}</div>
                    <div className="game-board">{this.renderBoard()}</div>
                    <div className="readyBtn">{this.renderReadyBtn()}</div>
                </div>
            )
        } else if(role === 1 && rnd !== 1) {
            return (
                <div>
                    <div className="turn-info">{this.renderInfoMsg()}</div>
                    <div className="game-board">{this.renderBoard()}</div>
                </div>
            )
        } else if(role === 0 && rnd === 3) { // Red checkbox
            return (
                <div>
                    <div className="turn-info">{this.renderInfoMsg()}</div>
                    <div className="game-board">{this.renderBoard()}</div>
                    <div className="readyBtn">{this.renderReadyBtn()}</div>
                </div>
            )
        } else if(role === 0 && rnd !== 3) {
            return (
                <div>
                    <div className="turn-info">{this.renderInfoMsg()}</div>
                    <div className="game-board">{this.renderBoard()}</div>
                </div>
            )
        } else if(role <= 3){
            return (
                <div>
                    <div className="turn-info">{this.renderInfoMsg()}</div>
                    <div className="game-board">{this.renderBoard()}</div>
                    <h3 className="kmHeader">Keymap:</h3>
                    <div className="keymap">{this.renderKeymap()}</div>
                    <div className="agentInput">{this.renderAgentInput()}</div>
                </div>
            )
        }
    }

    renderFinalPhase() {
        let winner = this.state.game.winner;
        if(winner === 0){
            return (
                <div className="finalDiv">
                    <img src={ require('./gameover.png') } alt="Game Over!"/>
                    <h2 className="winnerInfo">Red Team won!</h2>
                </div>
            )
        } else {
            return (
                <div className="finalDiv">
                    <img src={ require('./gameover.png') } alt="Game Over!"/>
                    <h2 className="winnerInfo">Blue Team won!</h2>
                </div>
            )
        }

    }

    submitAgentNo(){
        let e = document.getElementById("agentNoSelect");
        let value = e.options[e.selectedIndex].value;
        let state = this.state.game;

        state.roundNumber = state.roundNumber + 1;
        state.agentNo = Number(value);

        this.setState(state);
    }

    renderAgentInput(){
        let rnd = this.state.game.roundNumber % 4; // 0->Blue SM, 1->BlueTeam, 2->Red SM, 3->RedTeam
        let element;
        let role = this.state.game.playerTeams[userID]; // 0->RedTeam, 1->BlueTeam, 2->red sm, 3->blue sm

        if(rnd === 0 && role === 3) {
            element = <div className="agentInputDiv">
                        <p className="agentNoTxt">Agent No:</p>
                        <select id="agentNoSelect">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                        <button className="submitAgentNoBtn" onClick={() => this.submitAgentNo()}>Submit</button>
                    </div>
        } else if(rnd === 1 && role === 1) {
            element = null;
        } else if(rnd === 2 && role === 2) {
            element = <div className="agentInputDiv">
                        <p className="agentNoTxt">Agent No:</p>
                        <select id="agentNoSelect">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <button className="submitAgentNoBtn" onClick={() => this.submitAgentNo()}>Submit</button>
                    </div>
        } else {
            element = null;
        }

        return element;
    }

    renderTeamPick() {
        return (
            <div className="team-options">
                <h3 className="welcomeMsg">Welcome to Codenames,</h3>
                <h3 className="pickTeamMsg">Please pick a team:</h3>
                <Option value={this.teams[0]} onClick={() => this.pickTeam(this.teams[0])}/>
                <Option value={this.teams[1]} onClick={() => this.pickTeam(this.teams[1])}/>
            </div>
        )
    }

    renderWaitPlayers() {
        let team;
        if(pickedTeam === 0)
            team = "Red Team";
        else
            team = "Blue Team";
        return (
            <div className="waitPlayer">
                <img src={ require('./clock.png') } alt="Waiting.."/>
                <h2 className="pickedTeamInfo">You picked {team}!</h2>
                <h3 className="waitForOthersMsg">Waiting for other players to pick a team...</h3>
                <button onClick={() => this.changeTeam()}>Change Team</button>
            </div>
        )
    }

    renderInfoMsg() {
        let color;
        let turn = this.state.game.roundNumber % 4;
        let role = this.state.game.playerTeams[userID];

        if(turn === 0 || turn === 1)
            color = "blue";
        else
            color = "red";

        return (
            <InfoMsg role={role} turn={turn} color={color}/>
        )
    }

    renderBoard() {
        return (
            <div>
                <Board renderCards={(i) => this.renderCards(i)} />
            </div>
        )
    }

    renderKMCell(index){
        let km = this.state.game.keymap;
        let blues = km.blues;
        let reds = km.reds;
        let civs = km.civ;
        let ass = km.assassin;
        let element;

        if(blues.indexOf(index) !== -1){
            element = <div className="blueKM"></div>;
        } else if(reds.indexOf(index) !== -1){
            element = <div className="redKM"></div>;
        } else if(civs.indexOf(index) !== -1){
            element = <div className="civKM"></div>;
        } else {
            element = <div className="assKM"></div>;
        }

        return element;
    }

    renderReadyBtn() {
        let state = this.state.game;

        if(state.checkedPlayers.indexOf(userID) !== -1){
            return (
                <button className="notReadyBtn" onClick={() => this.notReadyPressed()}>Not Ready</button>
            )
        }
        else{
            return (
                <button className="readyBtn" onClick={() => this.readyPressed()}>Ready</button>
            )
        }
    }

    renderKeymap() {
        return (
            <table>
                <tbody>
                <tr>
                    <td>{this.renderKMCell(0)}</td>
                    <td>{this.renderKMCell(1)}</td>
                    <td>{this.renderKMCell(2)}</td>
                    <td>{this.renderKMCell(3)}</td>
                </tr>
                <tr>
                    <td>{this.renderKMCell(4)}</td>
                    <td>{this.renderKMCell(5)}</td>
                    <td>{this.renderKMCell(6)}</td>
                    <td>{this.renderKMCell(7)}</td>
                </tr>
                <tr>
                    <td>{this.renderKMCell(8)}</td>
                    <td>{this.renderKMCell(9)}</td>
                    <td>{this.renderKMCell(10)}</td>
                    <td>{this.renderKMCell(11)}</td>
                </tr>
                <tr>
                    <td>{this.renderKMCell(12)}</td>
                    <td>{this.renderKMCell(13)}</td>
                    <td>{this.renderKMCell(14)}</td>
                    <td>{this.renderKMCell(15)}</td>
                </tr>
                </tbody>
            </table>
        )
    }

    pickTeam(team) {
        let state = this.state.game;

        pickedTeam = team;
        state.playerTeams[userID] = team;
        playerPhase = 1;
        if(state.playerTeams.indexOf(-1) === -1 ) { // All players picked a team
            state.phase = 2;
            let random = Math.floor((Math.random() * state.playerNo/2));
            let red = 0;
            let blue = 0;
            for(let i=0; i<state.playerNo; i++){
                if(state.playerTeams[i] === 0){
                    if(red === random){
                        state.playerTeams[i] = 2; // Red Spymaster -> 2
                    }
                    red++;
                }
                if(state.playerTeams[i] === 1){
                    if(blue === random){
                        state.playerTeams[i] = 3; // Blue Spymaster -> 3
                    }
                    blue++;
                }
            }
            //console.log(state.playerTeams);
            state.bluePlayerNo = blue-1;
            state.redPlayerNo = red-1;
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

    notReadyPressed() {
        let state = this.state.game;
        let ind = state.checkedPlayers.indexOf(userID);
        state.checkedPlayers.splice(ind, 1);

        this.setState(state);
    }

    readyPressed() {
        let state = this.state.game;
        let rnd = state.roundNumber % 4;
        state.checkedPlayers.push(userID);

        if(rnd === 1 && state.checkedPlayers.length === state.bluePlayerNo){ // Every blue member is ready
            for(let i=0; i<state.bluePlayerNo; i++)
                state.checkedPlayers.pop();
            this.evaluateRound();
        } else if(rnd === 3 && state.checkedPlayers.length === state.redPlayerNo){ // Every red member is ready
            for(let i=0; i<state.redPlayerNo; i++)
                state.checkedPlayers.pop();
            this.evaluateRound();
        }

        this.setState(state);
    }

    finishGame(i) {
        let state = this.state.game;
        let rnd = state.roundNumber % 4;
        let winner;
        if(i === 0 && rnd === 1){
            //alert("Red won!");
            winner = 0;
        } else if(i === 0 && rnd === 3){
            // alert("Blue won!");
            winner = 1;
        } else if(i === 1){ // blue
            // alert("Blue won!");
            winner = 1;
        } else if(i === 2){
            // alert("Red won!");
            winner = 0;
        }
        //alert(i);
        //alert(rnd);
        state.phase = state.phase + 1;
        state.winner = winner;

        this.setState(state);
    }

    evaluateRound() {
        let state = this.state.game;
        //let rnd = state.roundNumber;
        let selectedAgents = state.selectedAgents;
        let keymap = state.keymap;
        let blues = keymap.blues;
        let reds = keymap.reds;
        let civs = keymap.civ;
        let ass = keymap.assassin;
        let blueFinished = true;
        let redFinished = true;

        for(let i=0; i<selectedAgents.length; i++)
            state.revealedFields.push(selectedAgents[i]);

        if(selectedAgents.indexOf(ass) !== -1){
            this.finishGame(0);
        }
        // all blue agents revealed
        for(let i=0; i<6; i++){
            if(state.revealedFields.indexOf(blues[i]) === -1)
                blueFinished = false;
        }
        if(blueFinished)
            this.finishGame(1);

        // all red agents revealed
        for(let i=0; i<5; i++){
            if(state.revealedFields.indexOf(reds[i]) === -1)
                redFinished = false;
        }
        if(redFinished)
            this.finishGame(2);

        if(!redFinished || !blueFinished){
            state.roundNumber = state.roundNumber + 1;
        }

        for(let i=0; i<selectedAgents.length;){
            selectedAgents.pop();
        }

        this.setState(state);
    }

    checkAgents(i) {
        let state = this.state.game;
        let rnd = state.roundNumber % 4;
        let role = state.playerTeams[userID];

        let selected = state.selectedAgents.length;
        let max = state.agentNo;

        if(rnd === 1 && role === 1){
            if(state.selectedAgents.indexOf(i) !== -1){
                let ind = state.selectedAgents.indexOf(i);
                state.selectedAgents.splice(ind, 1);
            }
            else if(selected < max){
                state.selectedAgents.push(i);
            }
        }
        if(rnd === 3 && role === 0){
            if(state.selectedAgents.indexOf(i) !== -1){
                let ind = state.selectedAgents.indexOf(i);
                state.selectedAgents.splice(ind, 1);
            }
            else if(selected < max){
                state.selectedAgents.push(i);
            }
        }
        //alert(state.selectedAgents);
        this.setState(state);
    }

    render() {
        let element;

        if(playerPhase === 0){
            element = this.renderTeamPick();
        } else if(this.state.game.phase === 2){
            element = this.renderGamePhase();
        } else if(this.state.game.phase === 3){
            element = this.renderFinalPhase();
        } else if(playerPhase === 1) {
            element = this.renderWaitPlayers();
        }

        return (
            <div className="codeNamesBackground">
                {element}
            </div>
        );
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

class Card extends React.Component {
    setRevealed(){
        let rvldFields = this.props.rvldFields;
        if(rvldFields.indexOf(this.props.no) !== -1){
            if(this.props.kmap.blues.indexOf(this.props.no) !== -1){
                return "rvldBlue";
            } else if(this.props.kmap.reds.indexOf(this.props.no) !== -1){
                return "rvldRed";
            } else if(this.props.kmap.civ.indexOf(this.props.no) !== -1){
                return "rvldCiv";
            }
        }
    }
    setSelectedAgents(){
        let slctAgents = this.props.slctAgents;
        if(slctAgents.indexOf(this.props.no) !== -1)
            return "selected";
        else
            return null;
    }
    render() {
        return (
            <div className={"wordCard " + this.setSelectedAgents() + " " + this.setRevealed()} onClick={(i) => this.props.checkAgents(this.props.no)}>
                <h3>{this.props.word}</h3>
            </div>
        );
    }
}

class InfoMsg extends React.Component {
    setClass() {
        return "infoMsg " + this.props.color;
    }
    setTurn() {
        if(this.props.turn === 0){
            return "Blue Spymaster";
        } else if(this.props.turn === 1){
            return "Blue Team";
        } else if(this.props.turn === 2){
            return "Red Spymaster";
        } else if(this.props.turn === 3){
            return "Red Team";
        }
    }
    setRole() {
        if(this.props.role === 0){
            return "Red Team!";
        } else if(this.props.role === 1) {
            return "Blue Team!";
        } else if(this.props.role === 2) {
            return "Red Spymaster!";
        } else {
            return "Blue Spymaster!";
        }
    }
    render() {
        return (
            <div className={this.setClass()}>
                <h3><span className="strong">{this.setTurn()}</span>'s turn. (Your role is {this.setRole()})</h3>
            </div>
        );
    }
}

class Board extends React.Component {
    // let playerNum;
    render() {
        return (
            <table>
                <tbody>
                <tr>
                    <td>{this.props.renderCards(0)}</td>
                    <td>{this.props.renderCards(1)}</td>
                    <td>{this.props.renderCards(2)}</td>
                    <td>{this.props.renderCards(3)}</td>
                </tr>
                <tr>
                    <td>{this.props.renderCards(4)}</td>
                    <td>{this.props.renderCards(5)}</td>
                    <td>{this.props.renderCards(6)}</td>
                    <td>{this.props.renderCards(7)}</td>
                </tr>
                <tr>
                    <td>{this.props.renderCards(8)}</td>
                    <td>{this.props.renderCards(9)}</td>
                    <td>{this.props.renderCards(10)}</td>
                    <td>{this.props.renderCards(11)}</td>
                </tr>
                <tr>
                    <td>{this.props.renderCards(12)}</td>
                    <td>{this.props.renderCards(13)}</td>
                    <td>{this.props.renderCards(14)}</td>
                    <td>{this.props.renderCards(15)}</td>
                </tr>
                </tbody>
            </table>
        );
    }
}