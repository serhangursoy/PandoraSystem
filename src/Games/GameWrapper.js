

import {Component} from 'react'
import {} from 'react-redux'
import {SocketConnection} from './GameSocketConnection'


export default class GameWrapper extends Component {
    constructor(props){
        super(props);
        SocketConnection.startGame.bind(this)();
        

    }

    componentWillUpdate(){
        SocketConnection.sendGameState.bind(this)();

    }

    componentWillMount(){
        SocketConnection.getGameState(this.setState.bind(this))
    }


    componentWillUnmount(){
        SocketConnection.exitGame.bind(this)();
    }

}


