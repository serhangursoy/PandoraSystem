import React, { Component } from 'react';
import BrandIcon from '../image/pandico.png';
import Meteor from '../image/meteor.gif';

class Welcome extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let customStyle = { backgroundImage: "url(" + Meteor + ")" };

        return (
            <div className="page-header">
                <div className="page-header-image" style={customStyle}></div>
                <div className="container">
                    <div className="col-md-4 content-center">
                        <div className="photo-container logo">
                            <img src={BrandIcon} alt=""/>
                        </div>
                        <h1 className="welcome-message">Welcome to Pandora!</h1>
                        <h5>You can simply close this window and start using Pandora <br/> from <i>ANY</i> browser in your device!</h5>
                        <a className="btn btn-warning" onClick={this.props.dummyClicked}> If you are already on a browser, click this</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Welcome;
