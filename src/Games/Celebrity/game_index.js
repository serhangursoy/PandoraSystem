

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

        this.state.game = {

        };


    }




    render() {
    }
}


