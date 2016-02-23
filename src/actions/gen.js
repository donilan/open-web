const fetch = require('isomorphic-fetch');

const __API_SERVER__ = 'http://api.ii2d.com/api/v1';
export const RECEIVE_FIELDS = 'RECEIVE_FIELDS';
export const RECEIVE_DATA = 'RECEIVE_DATA';

export function fetchDataUrl(fields, type='csv') {
  return `${__API_SERVER__}/gen.${type}?q=${JSON.stringify(fields)}`;
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
    payload: fetch(`${__API_SERVER__}/gen/metas`).then((resp)=> resp.json())
  };
}
