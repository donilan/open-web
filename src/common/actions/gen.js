import fetch from 'isomorphic-fetch';
import config from '../config';

export const RECEIVE_FIELDS = 'RECEIVE_FIELDS';
export const RECEIVE_DATA = 'RECEIVE_DATA';

export function fetchDataUrl(fields, type='csv') {
  return `${config.api_server}/gen.${type}?q=${JSON.stringify(fields)}`;
}

export function fetchData(fields) {
  return {
    type: RECEIVE_DATA,
    payload: fetch(fetchDataUrl(fields)).then((resp)=> resp.text())
  };
}

export function fetchFieldsMeta() {
  return {
    type: RECEIVE_FIELDS,
    payload: fetch(`${config.api_server}/gen/metas`).then((resp)=> resp.json())
  };
}
