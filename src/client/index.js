import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from '../common/store/configureStore';
import routes from '../common/routes';
import '../common/style/app.scss';

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
/* const history = syncHistoryWithStore(hashHistory, store); */
const history = hashHistory;
const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router routes={routes} history={history} />,
  rootElement
);

/* ReactDOM.render(
   <Provider store={store}>
   <Router routes={routes} history={history} />
   </Provider>,
   rootElement
   ); */
