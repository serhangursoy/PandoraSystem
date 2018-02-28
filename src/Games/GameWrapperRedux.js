import {Component} from 'react'
import {} from 'react-redux'
import {SocketConnection} from './SocketConnection'


export default class GameWrapperRedux extends Component {
    constructor(props){
        super(props);
        SocketConnection.startGame.bind(this)();
        this.state = {}


    }

    handleReduxStateChange(){
        if(this.state !== null) {
            let currentState = this.state.store.getState();
            SocketConnection.reduxListener(currentState)
        }
    }


    componentWillMount(){
        if(this.state !== null)
            this.state.store.subscribe(this.handleReduxStateChange.bind(this));
    }



    componentWillUnmount(){
        SocketConnection.exitGame.bind(this)();
    }

}
