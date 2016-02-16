import React from 'react';
import { Route, Redirect } from 'react-router';
import App from './containers/App';
import * as containers from './containers';


const {
  GenPage
} = containers;


export default (
  <Route component={App}>
    <Redirect from="/" to="generator" />
    <Route path="/generator" component={GenPage} />
  </Route>
);
