import React from 'react';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import path from 'path';
import { RoutingContext, match } from 'react-router';
import { ReduxAsyncConnect, loadOnServer, reducer as reduxAsyncConnect } from 'redux-async-connect'
import createMemoryHistory from 'history/lib/createMemoryHistory';
import createLocation from 'history/lib/createLocation';

import webpackConfig from '../webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import express from 'express';
import webpack from 'webpack';
import { renderToString } from 'react-dom/server';
import reducers from '../src/reducers';

import createRoutes from '../src/routes';
import configureStore from '../src/store/configureStore';


const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
        res.render('index', { html, reduxState, scriptSrcs: []});
      });
    }
  });
});

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost: ' + port);
});
