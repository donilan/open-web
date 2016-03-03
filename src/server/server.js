import React from 'react';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import path from 'path';
import { RoutingContext, match } from 'react-router';
import { ReduxAsyncConnect, loadOnServer, reducer as reduxAsyncConnect } from 'redux-async-connect'
import createMemoryHistory from 'history/lib/createMemoryHistory';
import createLocation from 'history/lib/createLocation';

import webpackConfig from '../../webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import express from 'express';
import webpack from 'webpack';
import { renderToString } from 'react-dom/server';
import reducers from '../reducers';

import createRoutes from '../routes';
import configureStore from '../store/configureStore';


const app = express();

const renderFullPage = (html, initialState) => {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Isomorphic Redux Example</title>
        <link rel="stylesheet" type="text/css" href="/static/app.css">
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

if(process.env.NODE_ENV !== 'production'){
  console.log('webpack dev mode %s', webpackConfig.output.publicPath);
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}else{
  app.use('/static', express.static(__dirname + '/../dist'));
}

app.get('/*', function (req, res) {
  let history = createMemoryHistory();
  let store = configureStore();

  let routes = createRoutes(history);

  let location = createLocation(req.url);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      res.status(500).send(error.message);
    } else if (renderProps == null) {
      res.status(404).send('Not found')
    } else {
      loadOnServer({...renderProps, store, helpers: {}}).then(() => {
        let reduxState = JSON.stringify(store.getState());
        let html = renderToString(
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />

          </Provider>
        );
        res.status(200).end(renderFullPage(html, reduxState))
      });
    }
  });
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost: 3000');
});
