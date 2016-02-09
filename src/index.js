import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import { createHistory } from 'history';
require("bootstrap-sass/assets/stylesheets/_bootstrap.scss");
require('./app.scss');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const history = createHistory();


render(
  <Root history={history} />,
  document.getElementById('root')
);
