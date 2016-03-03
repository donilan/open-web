import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import configureStore from './store/configureStore';
import createRoutes from './routes';
import { Provider } from 'react-redux';
import createDevToolsWindow from './utils/createDevToolsWindow';

require("bootstrap-sass/assets/stylesheets/_bootstrap.scss");
require('./app.scss');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

let reduxState;
if (window.__INITIAL_STATE__) {
  reduxState = JSON.parse(unescape(window.__INITIAL_STATE__));
}

const store = configureStore(reduxState);

ReactDOM.render((
  <Provider store={store}>
    { createRoutes(browserHistory) }
  </Provider>
), document.getElementById('root'));


/* createDevToolsWindow(store); */
