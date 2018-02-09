import React, { Component } from 'react';
import Background from '../image/multipurpose.gif';

class AdminMenu extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let customStyle = { backgroundImage: "url(" + Background + ")" };

        return (
            <div className="page-header">
                <div className="page-header-image" style={customStyle}></div>
                <div className="container">
                    <div className="content-center">
                        <h5 className="adaptiveTitle">Admin Menu</h5>
                        <ul className="list-group">
                        <a className="list-group-item btn btn-info" onClick={this.props.adminCreateGame}> Create New Game</a>
                        <a className="list-group-item btn btn-purp"> Saved Games</a>
                        <a className="list-group-item btn"> Settings</a>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminMenu;
