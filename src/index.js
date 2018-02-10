import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './style/bootstrap.css';
import './style/kit.css';
import './style/custom.css';
import registerServiceWorker from './registerServiceWorker';

import App from "./App";

ReactDOM.render(
    <App/>, document.getElementById('root'));
registerServiceWorker();
