const fetch = require('isomorphic-fetch');
import { createAction } from 'redux-act';

export const addField = createAction();
export const modField = createAction();
export const requestData = createAction();
export const receiveData = createAction();
export const requestFields = createAction();
export const receiveFields = createAction();

export function fetchDataUrl(fields, type='csv') {
  return `${__API_SERVER__}/gen.${type}?q=${JSON.stringify(fields)}`;
}

export function fetchData(fields, dispatch) {
  dispatch(requestData());
  return fetch(fetchDataUrl(fields)).then((resp)=> resp.text())
                                    .then((text)=> dispatch(receiveData(text)));

}

export function fetchFieldsMeta() {
  return dispatch => {
    dispatch(requestFields());
    return fetch(`${__API_SERVER__}/gen/fields_meta`)
      .then((resp)=> resp.json())
      .then((json)=> dispatch(receiveFields(json)));
  }
}
