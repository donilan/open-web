import { Route, Redirect, IndexRoute } from "react-router";
import React from "react";

import App from "./containers/App";
import Home from './containers/Home';

export default (
  <Route name="app" path="/" component={App}>
    <IndexRoute name="home" component={Home} />
  </Route>
);
