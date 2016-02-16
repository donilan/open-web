import { combineReducers } from 'redux';
import { createReducer } from 'redux-act';
import {addField, requestFields, receiveFields, requestData, receiveData} from '../actions/gen';

const initialState = {
  running: false,
  fieldsMeta: [],
  data: null
};

export default createReducer({
  [requestFields]: (state) => (Object.assign({}, state, {running: true})),
  [receiveFields]: (state, meta) => (Object.assign({}, state, {fieldsMeta: meta, running: false})),
  [requestData]: (state) => (Object.assign({}, state, {running: true})),
  [receiveData]: (state, data) => (Object.assign({}, state, {data: data, running: false})),
}, initialState);
