import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from '../common/store/configureStore';
import routes from '../common/routes';
import "bootstrap-sass/assets/stylesheets/_bootstrap.scss";
import '../common/style/app.scss';

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const history = browserHistory;


ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>
  ,
  document.getElementById('root')
);
