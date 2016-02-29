import React from 'react';
import { Router, Route, Redirect } from 'react-router';
import { ReduxAsyncConnect } from 'redux-async-connect'
import App from './containers/App';
import * as containers from './containers';

export default function(history) {
  return (
    <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={history}>
      <Route component={App}>
        <Redirect from="/" to="generator" />
        <Route path="/generator" component={containers.GenPage} />
      </Route>
    </Router>
  );
};
