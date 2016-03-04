import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import { persistState } from 'redux-devtools';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import config from '../config';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

let middlewares = [thunkMiddleware, promiseMiddleware];
if(!config.is_server) {
  middlewares.push(loggerMiddleware);
}

const finalCreateStore = compose(
  applyMiddleware(...middlewares),
  DevTools.instrument()
)(createStore);


/**
 * Creates a preconfigured store.
 */
export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
