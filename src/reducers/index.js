import { combineReducers } from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect'
import counter from './counter';
import gen from './gen';
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  form: formReducer,
  reduxAsyncConnect,
  counter,
  gen
});


export default rootReducer;
