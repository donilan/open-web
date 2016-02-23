import React from 'react';
import { Router, Route, Redirect } from 'react-router';
import App from './containers/App';
import * as containers from './containers';

export default function(history) {
  return (
    <Router history={history}>
      <Route component={App}>
        <Redirect from="/" to="generator" />
        <Route path="/generator" component={containers.GenPage} />
      </Route>
    </Router>
  );
};
