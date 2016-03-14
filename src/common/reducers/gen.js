import { combineReducers } from 'redux';
import {RECEIVE_DATA, RECEIVE_FIELDS} from '../actions/gen';

const initialState = {
  fieldsMeta: [],
  data: null
};

export default function gen(state=initialState, action) {
  switch(action.type) {
    case RECEIVE_DATA:
      return Object.assign({}, state, {data: action.payload});
    case RECEIVE_FIELDS:
      return Object.assign({}, state, {fieldsMeta: action.payload});
    default:
      return state;
  }
}
