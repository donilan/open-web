const fetch = require('isomorphic-fetch');
import { createAction } from 'redux-act';

export const addField = createAction();
export const modField = createAction();
export const requestData = createAction();
export const receiveData = createAction();
export const requestFields = createAction();
export const receiveFields = createAction();

/* const HOST = 'api.ii2d.com'; */
const HOST = 'localhost:3001';

export function fetchData(fields, dispatch) {
  dispatch(requestData());
  return fetch(`http://${HOST}/api/v1/gen?params=${JSON.stringify(fields)}`)
                                                       .then((resp)=> resp.json())
                                                       .then((json)=> dispatch(receiveData(json)));

}

export function fetchFieldsMeta() {
  return dispatch => {
    dispatch(requestFields());
    return fetch(`http://${HOST}/api/v1/gen/fields_meta`)
      .then((resp)=> resp.json())
      .then((json)=> dispatch(receiveFields(json)));
  }
}
