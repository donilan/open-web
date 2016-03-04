import { combineReducers } from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect'
import gen from './gen';
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  form: formReducer,
  reduxAsyncConnect,
  gen
});


export default rootReducer;
