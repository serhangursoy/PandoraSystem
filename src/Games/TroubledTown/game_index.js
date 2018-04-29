

import React from "react"
import GameWrapperRedux from "../GameWrapper";

import ILL_IMG from "./img/ill.png";
import KING_IMG from "./img/king.png";
import SHER_IMG from "./img/sherriff.png";
import TRAI_IMG from "./img/traitor3.png";
import VILL1_IMG from "./img/villager.png";
import VILL2_IMG from "./img/villager2.png";
import VILL3_IMG from "./img/villager3.png";
import WERE1_IMG from "./img/were1.png";
import WERE2_IMG from "./img/were2.png";
import NIGHT from "./img/townnight.png";
import DAY from "./img/townday.png";
import KILL from "./img/kill.png";
import DEAD from "./img/dead.png";
import KILL_EMPTY from "./img/kill_empty.png";

import "./style.css"
import Cookies from "universal-cookie";

let username;
let userID;
let myRole;

const cookies = new Cookies();

export default class GameContainer extends GameWrapperRedux {
    constructor(props) {
        super(props);
        username = cookies.get(this.props.gameRoomID + "uname").toUpperCase();
        let tmpArr = [];
        for (let i = 0; i < props.users.length; i++)
            tmpArr.push(i);
        this.state.game = {
            "ID": props.gameRoomID,
            "playerRoles" : [],     // Names that left one implicated
            "gameStarted": false,
            "isNight": false,   // Who's turn
            "isReallyStarted": false,
            "playerStartOrder": [],
            "playerAffirmation": [],
            "deadPlayerIDs": [],
            "werewolvesClicked": [],
            // "sleepers": [],
            "selectedUser": 0,
            "decideMoment": true,
            "alivePlayers": tmpArr,
            "users": props.users
        };

        console.log(props);

        for(let i = 0; i < props.users.length; i++) {
            if (props.users[i].username === username) {
                userID = i;
                break;
            }
        }

    }

    createCardShuffle(){
        var rolesArr;
        if (this.props.users.length >= 9) {
            rolesArr = [ "SHERIFF", "TRAITOR", "ILLUMINATI", "WEREWOLF", "WEREWOLF2", "VILLAGER", "VILLAGER2", "VILLAGER3", "KING"];
            for (let k = 0; k < (this.users.length - 9); k++)
                rolesArr.push("VILLAGER2");
             return this.shuffle(rolesArr);
        } else if (this.props.users.length >= 7) {
            var random_boolean = Math.random() >= 0.5;
            rolesArr = [ "WEREWOLF", "WEREWOLF2", "VILLAGER", "VILLAGER2", "VILLAGER3", "KING"];
            if (random_boolean) {
                rolesArr.push("SHERIFF");
            }else {
                rolesArr.push("TRAITOR");
            }
            for (let k = 0; k < (this.users.length - 7); k++)
                rolesArr.push("VILLAGER2");
            return this.shuffle(rolesArr);
        } else {
            rolesArr = [ "WEREWOLF", "VILLAGER", "VILLAGER", "VILLAGER2", "KING"];
            return this.shuffle(rolesArr);
        }
    }

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    okayLetsStart(){
        let state = this.state.game;
        if (this.props.users.length - 1 == state.playerStartOrder.length) {
            state.gameStarted = true;
            // Need to create cards!
            state.playerRoles = this.createCardShuffle();
        } else {
            let tmpArr = state.playerStartOrder;
            tmpArr.push(userID);
            this.state = tmpArr;
        }

        this.setState(state);
    }

    didISayStart() {
        let tmpVar = this.state.game.playerStartOrder;
        for (let i = 0; i < tmpVar.length; i++) {
            if (userID == tmpVar[i])
                return true;
        }
        return false;
    }

    okayFineCard(){
        let state = this.state.game;
        if (this.props.users.length - 1 == state.playerAffirmation.length) {
            state.isReallyStarted = true;
            state.isNight = true;
        } else {
            let tmpArr = state.playerAffirmation;
            tmpArr.push(userID);
            this.state = tmpArr;
        }

        this.setState(state);
    }

    whoIsKing(){
        for(let i = 0; i < this.state.game.playerRoles.length; i++ ) {
            if (this.state.game.playerRoles[i] == "KING") {
                return this.props.users[i].username;
            }
        }
        return "No one"
    }

    amIKing() {
        // Yes, but in our hearts...

        if (this.state.game.playerRoles[userID] == "KING") {
            return true;
        } else {
            return false;
        }
    }

    parseKillablePeople() {
        let tmpArr = [];
        let alPpl = this.state.game.alivePlayers;
        for (let k = 0 ; k  < alPpl.length; k++) {
            if (this.state.game.playerRoles[alPpl[k]] ==  "WEREWOLF" || this.state.game.playerRoles[alPpl[k]] ==  "WEREWOLF2" || this.state.game.playerRoles[alPpl[k]] ==  "KING" ) {
                console.log("special char");
            }else {
                tmpArr.push(alPpl[k]);
            }
        }

        return tmpArr;
    }

    isGameOver(){
        // Is all werewolves are dead? Or all Villagers?
        let FOLK_WIN = true;
        let WERE_WIN = true;

        for(let k = 0; k < this.state.game.alivePlayers.length; k++) {
            let aliveID = this.state.game.alivePlayers[k];
            if ( this.state.game.playerRoles[aliveID] == "WEREWOLF" || this.state.game.playerRoles[aliveID] == "WEREWOLF2") {
                FOLK_WIN = false;
            }

            if ( this.state.game.playerRoles[aliveID] != "WEREWOLF" && this.state.game.playerRoles[aliveID] != "WEREWOLF2" && this.state.game.playerRoles[aliveID] != "KING") {
                WERE_WIN = false;
            }
        }

        if (WERE_WIN)
            return 2;
        else if (FOLK_WIN)
            return 1;
        else
            return 0;
    }

    didISeeMyCard(){
        let tmpVar = this.state.game.playerAffirmation;
        myRole = this.state.game.playerRoles[userID];
        for (let i = 0; i < tmpVar.length; i++) {
            if (userID == tmpVar[i])
                return true;
        }
        return false;
    }

    whoAmIShowCard(){
        let userRole = this.state.game.playerRoles[userID];
        if (userRole == "VILLAGER") {
            return <img src={VILL1_IMG}/>;
        } else if (userRole == "VILLAGER2") {
            return <img src={VILL2_IMG}/>;
        } else if (userRole == "VILLAGER3") {
            return <img src={VILL3_IMG}/>;
        } else if (userRole == "TRAITOR") {
            return <img src={TRAI_IMG}/>;
        }else if (userRole == "WEREWOLF") {
            return <img src={WERE1_IMG}/>;
        }else if (userRole == "WEREWOLF2") {
            return <img src={WERE2_IMG}/>;
        }else if (userRole == "SHERIFF") {
            return <img src={SHER_IMG}/>;
        }else if (userRole == "ILLUMINATI") {
            return <img src={ILL_IMG}/>;
        }else if (userRole == "KING") {
            return <img src={KING_IMG}/>;
        } else {
            return <img src={VILL2_IMG}/>;
        }
    }

    amIDead(){
        let state = this.state.game;
        for (let k = 0; k < state.deadPlayerIDs.length; k++)
            if ( state.deadPlayerIDs[k] == userID)
                return true;

        return false;
    }

    selectToKill(playerIDtoKill){
        let state = this.state.game;
        state.selectedUser = playerIDtoKill;
        this.setState(state);
    }

    finishKilling() {
        // check if others clicked too, if not, end night. ONLY SHERIFF CAN MAKE AN ACTION ACTUALLY
        let state = this.state.game;
        state.deadPlayerIDs.push(state.selectedUser);
        state.alivePlayers.splice(state.selectedUser,1);
        state.selectedUser = -1;
        state.isNight = false;
        state.decideMoment = true;
        this.setState(state);
    }

    killMe(killedID){
        let state = this.state.game;
        state.deadPlayerIDs.push(killedID);
        state.alivePlayers.splice(killedID,1);
        state.decideMoment = false;
        state.playerAffirmation = state.deadPlayerIDs.slice();
        this.setState(state);
    }

    render() {
        let rendElem;
        let customStyle;
        let fixerStyle = { margin: "8%", marginTop: "0", backgroundColor: "rgba(200,200,200,0.8)", color: "black", fontWeight: "bold", fontSize: "20px", borderRadius: "5px", borderStyle:"solid"};
        if (this.state.game.isNight) {
            customStyle = { backgroundImage: "url(" + NIGHT + ")", paddingTop: "10%", paddingBottom: "40%", backgroundSize: "cover",
                backgroundRepeat:   "no-repeat",
                backgroundPosition: "center center" };
        } else {
                customStyle = { backgroundImage: "url(" + DAY + ")", paddingTop: "10%", backgroundSize: "cover",
                    backgroundRepeat:   "no-repeat",
                    backgroundPosition: "center center" };
            }

        if (!this.state.game.gameStarted) {
            if (this.didISayStart()) {
                rendElem = <div> <p> We are waiting for everyone to read rules... </p> </div>;
            }else {
                let infoAboutGame = "";
                if (this.props.users.length >= 8) {
                    infoAboutGame = "This game contains different roles with different people. You can be King, Werewolf, Villager, Sheriff, Traitor and Illuminati. They have their own spesific roles for the game. Spesifications are explained in the cards however, we can summarize them as follows," +
                        "\n Villager: Discuss every morning about the suspected werewolf and convince the King for execution.\n Werewolf: Every night, werewolves decide to kill a player. \n King: This player decides and picks a player from the list and hangs him/her. Their identity will reveal after their death. Everyone knows who King is. \n Sheriff: This player can avoid one of player's death if that player is selected. \n Traitor: This player can win only if the werewolves win. \n Illuminati: This player knows the identity of another villager";
                } else if (this.props.users.length >= 6) {
                    infoAboutGame = "This game contains different roles with different people. You can be King, Werewolf, Villager, Sheriff, Traitor and Illuminati. They have their own spesific roles for the game. Spesifications are explained in the cards however, we can summarize them as follows," +
                        "\n Villager: Discuss every morning about the suspected werewolf and convince the King for execution.\n Werewolf: Every night, werewolves decide to kill a player. \n King: This player decides and picks a player from the list and hangs him/her. Their identity will reveal after their death. Everyone knows who King is. \n Sheriff: This player can avoid one of player's death if that player is selected. OR \n Traitor: This player can win only if the werewolves win. \n Illuminati: This player knows the identity of another villager";

                } else {
                    infoAboutGame = "This game contains different roles with different people. You can be King, Werewolf, Villager, Sheriff, Traitor and Illuminati. They have their own spesific roles for the game. Spesifications are explained in the cards however, we can summarize them as follows," +
                        "\n Villager: Discuss every morning about the suspected werewolf and convince the King for execution.\n Werewolf: Every night, werewolves decide to kill a player. \n King: This player decides and picks a player from the list and hangs him/her. Their identity will reveal after their death. Everyone knows who King is.";

                }
                rendElem = <div> <p> {infoAboutGame} </p>   <div className="exbtn darebutton" onClick={this.okayLetsStart.bind(this)}> Done </div> </div>;
            }
        } else {
            if (!this.state.game.isReallyStarted) {
                if (!this.didISeeMyCard()) {
                    rendElem = <div> <p> King is {this.whoIsKing()} <br/> You are ... </p> {this.whoAmIShowCard()} <div className="exbtn darebutton" onClick={this.okayFineCard.bind(this)}> Sleep </div> </div>
                } else {
                    rendElem = <div> <p> King is {this.whoIsKing()} <br/> You are ... </p> {this.whoAmIShowCard()} <div className="exbtn darebutton" aria-disabled="false"> Waiting </div> </div>
                }
            } else {
                // Real logic starts here.... Finally, eh? ...

                if (!this.amIDead()) {
                    // Check night or day. Act accordingly..
                    if (this.state.game.isNight) {
                        // If not werewolf, show sleep. Sheriff pick someone..
                        if (myRole == "WEREWOLF" || myRole == "WEREWOLF2") {

                            let killAbleLads = this.parseKillablePeople();
                            let listAdder = killAbleLads.map((uid, i) => {
                                return <div key={i}>
                                    <div className="row">
                                        <div className="col"> {this.props.users[uid].username} </div>
                                        <div className="col">
                                            <div>
                                                <label hidden={uid != this.state.game.selectedUser}> <img src={KILL}/>
                                                </label>
                                                <label hidden={uid == this.state.game.selectedUser}> <img
                                                    onClick={this.selectToKill.bind(this, uid)} src={KILL_EMPTY}/>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            });

                            rendElem = <div> {listAdder}  <div className="exbtn darebutton" onClick={this.finishKilling.bind(this)} aria-disabled={this.state.game.selectedUser == -1}> KILL</div> </div>;
                            // } else if (myRole == "SHERIFF") {
                        } else {
                            // Sleep thingy....
                            rendElem =<div><p> YOU ARE SLEEPING. When night ends, perhaps you may see the day light... </p>
                                </div>;
                        }
                    } else {
                        // If DAY, show table, announce last dead... Wait for reis to decide..

                        if (this.state.game.decideMoment) {
                            let overRes =this.isGameOver();
                            if (overRes == 0) {
                                let aliveUsers = this.state.game.alivePlayers;
                                let deadUsers = this.state.game.deadPlayerIDs;
                                let lastDeadPlayer = deadUsers[deadUsers.length - 1];
                                let htmlInfo = <p> Player <b> {this.props.users[lastDeadPlayer].username}</b> killed in
                                    this
                                    night. Player's card was <b> {this.state.game.playerRoles[lastDeadPlayer]}</b></p>;
                                let deadAdder = deadUsers.map((uid, i) => {
                                    return <div
                                        key={i}> {this.props.users[uid].username} : <b> {this.state.game.playerRoles[uid]} </b>
                                    </div>
                                });

                                htmlInfo = <span> {htmlInfo} <div> Dead Players <br/> {deadAdder} </div> </span>;
                                rendElem = htmlInfo;
                                if (this.amIKing()) {
                                    // let him click someone and execute!
                                    rendElem = <span> {rendElem} <p> Click one of the below, in order to execute </p> </span>;

                                    let listAdder = aliveUsers.map((uid, i) => {
                                        return <div key={i}>
                                            <div className="row">
                                                <div className="exbtn darebutton" onClick={this.killMe.bind(this, uid)}
                                                     hidden={uid == userID}> {this.props.users[uid].username}
                                                </div>
                                            </div>
                                        </div>
                                    });

                                    rendElem = <span> {rendElem} {listAdder} </span>;
                                } else {
                                    rendElem = <div> {rendElem} State your opinions to your King, to drive werevolves out of your
                                        town!</div>;
                                }
                            } else if (overRes == 1) {
                                rendElem = <div> YOU SUCCESSFULLY GET RID OF WEREWOLVES</div>;
                            } else if( overRes == 2) {
                                rendElem = <div> CAN YOU FEEL THE TASTE OF THEIR BLOOD? WEREWOLVES WON THE GAME! </div>;
                            }
                        } else {
                            let overRes =this.isGameOver();
                            if (overRes == 0) {
                            if (!this.didISeeMyCard()) {
                                rendElem = <div> <p> King is {this.whoIsKing()} <br/> You are ... </p> {this.whoAmIShowCard()} <div className="exbtn darebutton" onClick={this.okayFineCard.bind(this)}> Sleep </div> </div>
                            } else {
                                rendElem = <div> <p> King is {this.whoIsKing()} <br/> You are ... </p> {this.whoAmIShowCard()} <div className="exbtn darebutton" aria-disabled="false"> Waiting </div> </div>
                            }
                        } else if (overRes == 1) {
                            rendElem = <div> YOU SUCCESSFULLY GET RID OF WEREWOLVES</div>;
                        } else if( overRes == 2) {
                            rendElem = <div> CAN YOU FEEL THE TASTE OF THEIR BLOOD? WEREWOLVES WON THE GAME! </div>;
                        }
                        }

                    }
                }else {
                    rendElem = <div><img src={DEAD} color="white" alt=""/>You are dead!</div>
                }
            }
        }


        return(
            <div className="gameRealBody" style={customStyle}>
                <div style={fixerStyle}>
                {rendElem}
                </div>
            </div>
        )
    }
}


