import { Route, Redirect, IndexRoute } from "react-router";
import React from "react";

import App from "./containers/App";
import Home from './containers/Home';
import GenPage from './containers/GenPage';

export default (
  <Route name="app" path="/" component={App}>
    <IndexRoute name="home" component={Home} />
    <Route path="/generator" component={GenPage} />
  </Route>
);
