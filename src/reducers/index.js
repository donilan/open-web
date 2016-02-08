import { combineReducers } from 'redux';
import counter from './counter';
import gen from './gen';
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  form: formReducer,
  counter,
  gen
});


export default rootReducer;
