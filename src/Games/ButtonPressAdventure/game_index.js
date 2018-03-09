

import React from "react"
import GameWrapperRedux from "../GameWrapper";
import "./style.css"






export default class GameContainer extends GameWrapperRedux {
    constructor(props) {
        super(props);
        this.state.game.count = 0;
    }


    incrementButtonPressed() {
       this.setState({game: {count : this.state.game.count + 1}})
    }
    decrementButtonPressed() {
        this.setState({game:{count : this.state.game.count - 1}})
    }

    render() {
        console.log("render: ",this.state.game);
        return(
                <div className="mainContainer">
                    <div><span className="step">{this.state.game.count}</span></div>
                    <button onClick={this.incrementButtonPressed.bind(this)}>Increment</button>
                    <button onClick={this.decrementButtonPressed.bind(this)}>Decrement</button>
                </div>
        )
    }
}


