import {Component} from 'react'
import {} from 'react-redux'
import {SocketConnection} from './GameSocketConnection'


export default class GameWrapperRedux extends Component {
    constructor(props){
        super(props);

        this.state = {}



    }

 //   componentWillUpdate(){
 //       if(this.state !== null){
 //           SocketConnection.sendNewState(this.state.store.getState())
 //       }
 //   }


//    componentWillMount(){
//        if(this.state !== null)
//            this.state.store.subscribe(SocketConnection.sendNewState.apply(this.state.store.getState()));
//    }




}
