import React, { Component } from 'react';
import xObj from './static/img/xicon.svg'
import oObj from './static/img/oicon.svg'

import GameWrapperRedux from "../GameWrapper";
import Cookies from "universal-cookie";

const cookies = new Cookies();

let username;
export default class Board extends GameWrapperRedux {

    constructor(props) {
        super(props);
        console.log("GELEN PROPS ", props);
        username = cookies.get(this.props.gameRoomID + "uname").toUpperCase();
        this.state.game = {
            "ID": props.gameRoomID,
            "cells": [ [-1,-1,-1],[-1,-1,-1],[-1,-1,-1] ],
            "turn" : 0,  // Always start with player 1
            "moveCount": 0,
            "isOver": false,
            "isTied": false,
            "winner": null,
            "winlose": {
                "playerone": {
                    "win" : 0,
                    "lose" : 0
                },
                "playertwo": {
                    "win" : 0,
                    "lose" : 0
                }
            },
            "users": props.users
        };
    }

    cellClicked(clickedID) {
        if (!this.state.game.isOver) {
            let currState = this.state.game;
            console.log("Cookie username ", username, " lakin şu an oynaması gereken user ", this.props.users[currState.turn].username);
            if (username === this.props.users[currState.turn].username) {
                let cells = currState.cells;
                let turn = currState.turn;
                let row = Math.floor(clickedID / 3);
                let ind = (clickedID % 3);
                if ((cells[row])[ind] !== -1) {
                    return;
                }
                (cells[row])[ind] = turn;

                if (turn === 1) {
                    turn = 0;
                } else {
                    turn = 1;
                }
                currState.cells = cells;
                currState.turn = turn;
                currState.moveCount += 1;
                // console.log("Clicked: ID=" + clickedID + " Row:" + row + " Index:" + ind + "MATH " + (clickedID / 3)  );
                this.setState(currState);

                this.controlGamestatus(row, ind, (cells[row])[ind]);
            }
        }
    }

    controlGamestatus( lastActionRow, lastActionColumn, moveData) {
        let currState = this.state.game;
        console.log("ROW: " + lastActionRow + " COL: " + lastActionColumn + " DATA: " + moveData + " Turn: " + currState.turn );
        if (currState.moveCount === 9) {
            // DRAW
            console.log("Berabere kaldınız!");
            //alert("BERABERLIQUE");

            let tmpstate =  this.state.game;
            tmpstate.isOver = true;
            tmpstate.isTied = true;
            tmpstate.winner = "TIED!";
            this.setState(tmpstate);
            return;
        } else if (currState.moveCount < 4) {
            return;
        }
        let currCells = currState.cells;

        // Check horizontal
        let tmpCol = lastActionColumn;
        // Check left
        let tmpCount = 0;
        while(tmpCol > -1) {
            if((currCells[lastActionRow])[tmpCol] === moveData) {
                tmpCount++;
            }else {
                tmpCol = -1;
            }
            tmpCol--;
        }
        this.winnerNotif(tmpCount,moveData);
        if (tmpCount === 3) return;
        // Check right
        tmpCol = lastActionColumn;
        tmpCount = 0;
        while(tmpCol < 3) {
            if((currCells[lastActionRow])[tmpCol] === moveData) {
                tmpCount++;
            }else {
                tmpCol = 4;
            }
            tmpCol++;
        }
        this.winnerNotif(tmpCount,moveData);
        if (tmpCount === 3) return;
        // Vertical
        // Check up
        let tmpRow = lastActionRow;
        tmpCount = 0;
        while(tmpRow > -1) {
            if((currCells[tmpRow])[lastActionColumn] === moveData) {
                tmpCount++;
            } else {
                tmpRow = -2;
            }
            tmpRow--;
        }
        this.winnerNotif(tmpCount,moveData);
        if (tmpCount === 3) return;
        // Check down
        tmpRow = lastActionRow;
        tmpCount = 0;
        while(tmpRow < 3) {
            if((currCells[tmpRow])[lastActionColumn] === moveData) {
                tmpCount++;
            }else {
               tmpRow = 5;
            }
            tmpRow++;
        }
        this.winnerNotif(tmpCount,moveData);
        if (tmpCount === 3) return;
        // Check diagonal
        // LeftTop
        tmpRow = lastActionRow;
        tmpCol = lastActionColumn;
        tmpCount = 0;
        while(tmpRow > -1 && tmpCol > -1) {
            if((currCells[tmpRow])[tmpCol] === moveData) {
                tmpCount++;
            }else {
                break;
            }
            tmpRow--;
            tmpCol--;
        }
        this.winnerNotif(tmpCount,moveData);
        if (tmpCount === 3) return;
        // LeftBottom
        tmpRow = lastActionRow;
        tmpCol = lastActionColumn;
        tmpCount = 0;
        while(tmpRow < 3 && tmpCol > -1) {
            if((currCells[tmpRow])[tmpCol] === moveData) {
                tmpCount++;
            }else {
                break;
            }
            tmpRow++;
            tmpCol--;
        }
        this.winnerNotif(tmpCount,moveData);
        if (tmpCount === 3) return;
        // LeftTop
        tmpRow = lastActionRow;
        tmpCol = lastActionColumn;
        tmpCount = 0;
        while(tmpRow < 3 && tmpCol < 3) {
            if((currCells[tmpRow])[tmpCol] === moveData) {
                tmpCount++;
            }else {
                break;
            }
            tmpRow++;
            tmpCol++;
        }
        this.winnerNotif(tmpCount,moveData);
        if (tmpCount === 3) return;
        // LeftBottom
        tmpRow = lastActionRow;
        tmpCol = lastActionColumn;
        tmpCount = 0;
        while(tmpRow > -1 && tmpCol < 3) {
            if((currCells[tmpRow])[tmpCol] === moveData) {
                tmpCount++;
            }else {
                break;
            }
            tmpRow--;
            tmpCol++;
        }
        this.winnerNotif(tmpCount,moveData);
        if (tmpCount === 3) return;


        tmpRow = lastActionRow;
        tmpCol = lastActionColumn;
        if (lastActionColumn === 1 && lastActionRow === 1) {
            if ( ((currCells[tmpRow+1])[tmpCol+1] === moveData && (currCells[tmpRow-1])[tmpCol-1] === moveData) ||
                ((currCells[tmpRow])[tmpCol+1] === moveData && (currCells[tmpRow])[tmpCol-1] === moveData) ||
                ((currCells[tmpRow+1])[tmpCol] === moveData && (currCells[tmpRow-1])[tmpCol] === moveData) ||
                (currCells[tmpRow-1])[tmpCol+1] === moveData && (currCells[tmpRow+1])[tmpCol-1] === moveData ) {
                this.winnerNotif(3,moveData);
            }
        }
/*
        if (lastActionColumn !== 1) {

        }
        this.winnerNotif(tmpCount,moveData);
        if (tmpCount === 3) return;
        */
    }


    winnerNotif(score, possibleWinner) {
        if(score === 3) {
            console.log("Tebrikler oyuncu " + (possibleWinner+1) + " kazandı!");

            let tmpstate =  this.state.game;
            tmpstate.isOver = true;
            tmpstate.winner = possibleWinner+1;
            this.setState(tmpstate);

            // alert("Tebrikler oyuncu " + (possibleWinner+1) + " kazandı!");
            /* dispatch( {
                condition: "Finish",
                winner: possibleWinner
            });
            */
        }
    }

    getIcon(){
        let tmpStye= {
            width: "10%"
        };

        /*
        if(this.state.game.turn !== 1) {
            return ( <img src={oObj} style={tmpStye} alt="logo"/> );
        } else {
            return ( <img src={xObj}  style={tmpStye} alt="logo"/> );
        }
        */

        if(this.props.users[0].username === username) {
            return ( <img src={oObj} style={tmpStye} alt="logo"/> );
        } else {
            return ( <img src={xObj}  style={tmpStye} alt="logo"/> );
        }

    }

    resetButton(){
        this.setState({game:{
            "cells": [ [-1,-1,-1],[-1,-1,-1],[-1,-1,-1] ],
            "turn" : 0,  // Always start with player 1
            "moveCount": 0,
                "isOver": false,
                "isTied": false,
                "winner": null,
            "winlose": {
                "playerone": {
                    "win" : 0,
                    "lose" : 0
                },
                "playertwo": {
                    "win" : 0,
                    "lose" : 0
                }
            }
        }});
    }

    render() {
        let elements = [];
        let currState = this.state.game;
        let cellCount = 0;

        if(currState !== undefined) {
            console.log(currState);
            for (let i = 0; i < currState.cells.length; i++) {
                let tmpRow = currState.cells[i];
                let rowInner = [];
                for (let j = 0; j < tmpRow.length; j++) {
                    let tmpCell = tmpRow[j];
                    let cellInner;
                    if (tmpCell === 1) {
                        cellInner = <img src={xObj} className="MarkerX" alt="logo"/>;
                    } else if (tmpCell === 0) {
                        cellInner = <img src={oObj} className="Marker" alt="logo"/>;
                    }
                    rowInner.push(<td  key={ (j+1) * (i+1)} ><div className='CellBlocks' onClick={this.cellClicked.bind(this, cellCount)}><p/> {cellInner}</div></td>);
                    cellCount++;
                }
                elements.push(<tr key={i}>{rowInner}</tr>);
            }
        }

        const st = {
            margin: "auto",
            width: "100%",
        };
        const st2 = {
            margin: "auto",
        };
        const st3 = {
            marginTop: "15px",
        };

        let somePart;
        if (!this.state.game.isOver) {
            somePart = <span><h1> Player { this.state.game.turn  + 1 }'s turn.</h1>
                <h2> Your icon: { this.getIcon() }</h2></span>;
        } else {
            if (!this.state.game.isTied)
            somePart = <span><h1> Player { this.state.game.winner } WON! </h1></span>;
            else
                somePart = <span> <h1> TIED! </h1> </span>;
        }

        return (
            <div style={st}>
                { somePart }
                <table style={st2}>
                    <tbody>
                    {elements}
                    </tbody>
                </table>
                <button style={st3} onClick={this.resetButton.bind(this)}>Reset</button>
            </div>
        );
    }

}