import {Component} from 'react'
import {} from 'react-redux'
import {GameSocketConnection} from './GameSocketConnection'
import {SocketHandler} from "../system/SocketHandler"


export default class GameWrapperRedux extends Component {
    constructor(props){
        super(props);

        this.state = {};
        this.state.connection = this.props.connection;




    }

   componentWillUpdate(){
      if(this.state !== null){
          this.state.connection.sendNewState(this.state.store.getState());
       }
  }


//    componentWillMount(){
//        if(this.state !== null)
//            this.state.store.subscribe(GameSocketConnection.sendNewState.apply(this.state.store.getState()));
//    }




}
