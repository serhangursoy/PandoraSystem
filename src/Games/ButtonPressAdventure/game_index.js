

import React from "react"
import GameWrapperRedux from "../GameWrapperRedux";
import {Provider} from "react-redux"
import {createStore} from "redux"
import reducer from "./reducer"
import {incrementCounter , decrementCounter} from "./Actions"
import "./style.css"
import * as Actions from "./Actions";




export default class GameContainer extends GameWrapperRedux {
    constructor(props){
        super(props);

        this.state = {
            store: createStore(reducer , 0)
        };

        this.state.store.subscribe(function () {
            this.setState({gameState: this.state.store.getState()})
        }.bind(this))
    }


    incrementButtonPressed() {
        this.state.store.dispatch(Actions.incrementCounter());
    }
    decrementButtonPressed() {
        this.state.store.dispatch(Actions.decrementCounter())
    }



    render() {
        return(


            <div className="mainContainer">
                <div><span className="step">{this.state.store.getState()}</span></div>
                <button onClick={this.incrementButtonPressed.bind(this)}>Increment</button>
                <button onClick={this.decrementButtonPressed.bind(this)}>Decrement</button>
            </div>

        )
    }
}


