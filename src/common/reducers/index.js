import { combineReducers } from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect'
import { routerReducer as routing } from 'react-router-redux';
import gen from './gen';
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  form: formReducer,
  routing,
  reduxAsyncConnect,
  gen
});
export default rootReducer;
