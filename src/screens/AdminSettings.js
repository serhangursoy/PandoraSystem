import React, { Component } from 'react';
import Background from '../image/multipurpose.gif';

import Modal from 'react-responsive-modal';

class AdminSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clickedGameID: null,
            wifiname: "",
            password: "",
            ModalHandler: {
                nameModal: {
                    open: false
                },
                modalError: {
                    open: false
                },
                modalSuccess : {
                    open: false
                }
            }
        }
    }


    openPopupModal(gameID){
        let stateInit = this.state;
        stateInit.clickedGameID = gameID;
        stateInit.ModalHandler.nameModal.open = true;
        this.setState(stateInit);
    }


    nameChange( e ) {
        let tmpState = this.state;
        tmpState.wifiname = e.target.value;
        this.setState(tmpState);
    }

    passwordChange( e ) {
        let tmpState = this.state;
        tmpState.password = e.target.value;
        this.setState(tmpState);
    }

    localHandler() {
        let wName = this.state.wifiname;
        let wPass = this.state.password;
        if(wName != "" && wPass != "") {
            let isOkay =  this.props.changeWifiSettings(wName,wPass);
            if(!isOkay) {
                this.openErrorModal();
            } else {
                this.openSuccessModal();
            }
        }
    }


    closePopupModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.nameModal.open = false;
        this.setState(stateInit);
    }



    openErrorModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.modalError.open = true;
        this.setState(stateInit);
    }

    openSuccessModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.modalSuccess.open = true;
        this.setState(stateInit);
    }

    closeErrorModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.modalError.open = false;
        this.setState(stateInit);
    }

    closeSuccessModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.modalSuccess.open = false;
        this.setState(stateInit);
    }


    render() {
        let customStyle = { backgroundImage: "url(" + Background + ")" };

        return (

            <div className="page-header">
                <div className="page-header-image" style={customStyle}></div>
                <div className="container">
                    <div className="content-center">
                        <h5 className="adaptiveTitle">Settings</h5>
                        <ul className="list-group">
                            <a className="list-group-item btn btn-info" onClick={this.openPopupModal.bind(this)}> Change Wifi Credentials</a>
                            <a className="list-group-item btn btn-secondary" > Change Admin Password </a>
                            <a className="list-group-item btn btn-danger" onClick={this.props.resetBox}> Reset Pandora</a>
                            <br/><br/><br/>
                            <a className="btn btn-warning" onClick={this.props.goBack}> Return to Menu </a>
                        </ul>
                    </div>
                </div>
                <Modal open={this.state.ModalHandler.nameModal.open} onClose={this.closePopupModal.bind(this)}>
                    <div className="modal-body">
                        <label> Wifi Broadcasting Name</label>
                        <input type="text" className="form-control" placeholder="WiFi Name.." onChange={this.nameChange.bind(this)}/>
                        <label> Wifi Password</label>
                        <input type="text" className="form-control" placeholder="Password.." onChange={this.passwordChange.bind(this)}/>
                    </div>
                    <div>
                        <a className="btn btn-success btn-round btn-lg btn-block" onClick={this.localHandler.bind(this)}>Done</a>
                    </div>
                </Modal>

                <Modal classNames={{ modal: "modal-error"}} open={this.state.ModalHandler.modalError.open} onClose={this.closeErrorModal.bind(this)}>
                    <div className="modal-body">
                        <a>Error!</a>
                    </div>
                </Modal>

                <Modal classNames={{ modal: "modal-success"}} open={this.state.ModalHandler.modalSuccess.open} onClose={this.closeSuccessModal.bind(this)}>
                    <div className="modal-body">
                        <a>Done!</a>
                    </div>
                </Modal>

            </div>
        );
    }
}

export default AdminSettings;
