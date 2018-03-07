import React, { Component } from 'react';
import BrandIcon from '../image/pandico.png';
import Background from '../image/space.gif';
import Modal from 'react-responsive-modal';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userConnID: null,
            ModalHandler: {
                popUp: {
                    open: false
                },
                error: {
                    open: this.props.isLoginFailed
                }
            },
            password: null
        }
    }

    passChange( e ) {
        let tmpState = this.state;
        tmpState.password = e.target.value;
        this.setState(tmpState);
    }

    localHandler() {
        let pass = this.state.password;
        if(pass != null) {
            let isOkay = this.props.adminLogin(pass);

            if(!isOkay) {
                this.openErrorModal();
            }

        } else {
            alert("Empty!")
        }
    }

    openPopupModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.popUp.open = true;
        this.setState(stateInit);
    }

    closePopupModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.popUp.open = false;
        this.setState(stateInit);
    }

    openErrorModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.error.open = true;
        this.setState(stateInit);
    }

    closeErrorModal(){
        let stateInit = this.state;
        stateInit.ModalHandler.error.open = false;
        this.setState(stateInit);
    }

    render() {
        let customStyle = { backgroundImage: "url(" + Background + ")" };

        return (
            <div className="page-header">
                <div className="page-header-image" style={customStyle}></div>
                <div className="container">
                    <div className="col-md-4 content-center">
                        <div className="photo-container logo">
                            <img src={BrandIcon} alt=""/>
                        </div>
                        <h1 className="welcome-message">Pandora</h1>
                        <p> Adventure for only those who can endure! </p>
                        <div className="card-login card-plain">
                            <div className="button-holder text-center">
                                <a className="btn btn-primary btn-round btn-lg btn-block" onClick={this.openPopupModal.bind(this)}>Login as Admin</a>
                            </div>
                            <div className="button-holder text-center">
                                <a className="btn btn-primary btn-round btn-lg btn-block" onClick={this.props.goGameRooms}>Login as Guest</a>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal open={this.state.ModalHandler.popUp.open} onClose={this.closePopupModal.bind(this)}>
                    <div className="modal-body">
                        <input type="text" className="form-control" placeholder="Admin Password" onChange={this.passChange.bind(this)}/>
                    </div>
                    <div>
                        <a className="btn btn-success btn-round btn-lg btn-block" onClick={this.localHandler.bind(this)}>Done</a>
                    </div>
                </Modal>


                <Modal classNames={{ modal: "modal-error"}} open={this.state.ModalHandler.error.open} onClose={this.closeErrorModal.bind(this)}>
                    <div className="modal-body">
                        <a>Wrong password!</a>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Login;
