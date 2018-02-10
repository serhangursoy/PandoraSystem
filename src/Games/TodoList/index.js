import React from 'react';
import { render } from 'react-dom';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import todoApp from './reducers';
// Redux DevTools store enhancers
import { devTools, persistState } from 'redux-devtools';
// React components for Redux DevTools
import GameWrapperRedux from "../GameWrapperRedux";

const finalCreateStore = compose(
  // Provides support for DevTools:
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions

)(createStore);

const store = finalCreateStore(todoApp);

//let store = createStore(todoApp);



export default class AppWrapper extends GameWrapperRedux {
    constructor(){
        super();
        this.state = {store: store}
    }

    render() {
return  <div>
            <Provider store={store}>
                <App />
            </Provider>
        </div>
 }
}

