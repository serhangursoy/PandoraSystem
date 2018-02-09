import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './style/bootstrap.css';
import './style/kit.css';
import './style/custom.css';
import Presenter from './system/Presenter';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Presenter />, document.getElementById('root'));
registerServiceWorker();
