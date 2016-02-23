import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import configureStore from './store/configureStore';
import createRoutes from './routes';
import { Provider } from 'react-redux';
import createDevToolsWindow from './utils/createDevToolsWindow';

require("bootstrap-sass/assets/stylesheets/_bootstrap.scss");
require('./app.scss');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const history = createBrowserHistory();

let reduxState;
if (window.__REDUX_STATE__) {
  try {
    reduxState = JSON.parse(unescape(__REDUX_STATE__));
  } catch (e) {
  }
}

const store = configureStore(reduxState);

ReactDOM.render((
  <Provider store={store}>
    { createRoutes(history) }
  </Provider>
), document.getElementById('root'));


/* createDevToolsWindow(store); */
