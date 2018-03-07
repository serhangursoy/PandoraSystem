import {Component} from 'react'
import {SocketHandler} from "../system/SocketHandler"


export default class GameWrapper extends Component {
    constructor(props){
        super(props);
        this.state = {
            connection: SocketHandler.newGameSocketConnection(this.props.gameRoomID, this.setServerState.bind(this)),
            updatedFromServer: false,
            game: {}
        };
        return this;
    }


    setServerState(serverState){
        console.log("will update?" , JSON.stringify(this.state.game)!== JSON.stringify(serverState));
        console.log(serverState);
        console.log(this.state);
        if(JSON.stringify(this.state.game) !== JSON.stringify(serverState))
            this.setState({
                game: serverState,
                updatedFromServer: true
            } , function () {
                this.state.updatedFromServer = false;
            }.bind(this))

    }

    componentDidUpdate(){
        console.log("Sending the new state", this.state.game);
        if(this.state.updatedFromServer === false)
            this.state.connection.sendNewState(this.state.game);
    }

}
