import React from 'react';
import path from 'path';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { RoutingContext, match } from 'react-router';
import { ReduxAsyncConnect, loadOnServer, reducer as reduxAsyncConnect } from 'redux-async-connect'
import createMemoryHistory from 'history/lib/createMemoryHistory';
import createLocation from 'history/lib/createLocation';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import express from 'express';
import webpack from 'webpack';
import { renderToString } from 'react-dom/server';


import createRoutes from '../common/routes';
import configureStore from '../common/store/configureStore';
import webpackConfig from '../../webpack.config';

const app = express();

const renderFullPage = (html, initialState) => {
  let css = process.env.NODE_ENV === 'production' ? '<link rel="stylesheet" type="text/css" href="/static/app.css">' : '';
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0" name="viewport" />
        <title>II2D</title>
        ${css}
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/static/app.js"></script>
      </body>
    </html>
  `;
}

if(process.env.NODE_ENV === 'production'){
  app.use('/static', express.static(__dirname + '/../../www'));
}else{
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.get('/*', function (req, res) {
  if(process.env.NODE_ENV === 'production' || process.env.SERVER_RENDER){
    let history = createMemoryHistory();
    let store = configureStore();
    let location = createLocation(req.url);
    let routes = createRoutes(history);
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
  } else {
    res.status(200).end(renderFullPage('', {}));
  }
})

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
