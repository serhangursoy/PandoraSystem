import React,{Component} from 'react'
import {SocketHandler} from "../system/SocketHandler"


export default class GameWrapper extends Component {
    constructor(props){
        super(props);
        this.state = {
            connection: SocketHandler.newGameSocketConnection(this.setServerState.bind(this)),
            updatedFromServer: false,
            game: {}
        };
        this.state.connection.enterGame(this.props.gameRoomID);
        this.state.gameRoomID = this.props.gameRoomID;

        return this;
    }

    setServerState(serverState){
        console.log("will update?" , JSON.stringify(this.state.game)!== JSON.stringify(serverState));
        if(JSON.stringify(this.state.game) !== JSON.stringify(serverState)) {
            console.log("yeni state geldi: ", serverState);
            if(JSON.stringify(serverState) !== JSON.stringify({}))
                this.setState({
                    game: serverState,
                    updatedFromServer: true
                }, function () {
                    this.state.updatedFromServer = false;
                }.bind(this))
        }

    }

    componentDidUpdate(){
        if(this.state.updatedFromServer === false) {
            console.log("yeni state yaptım atıyom: ", this.state.game);
            this.state.connection.sendNewState(this.state.game, this.state.gameRoomID);
        }
    }

}
