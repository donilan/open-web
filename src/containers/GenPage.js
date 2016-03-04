import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ReduxAsyncConnect, asyncConnect } from 'redux-async-connect'
import _ from 'lodash';

import GenForm from '../components/GenForm';
import * as GenActions from '../actions/gen';

const INITIAL_VALUES = {rows: 50, format: 'json', fields: [
  {name: 'id', type: 'row_number'},
  {name: 'email', type: 'email'},
  {name: 'gender', type: 'gender'},
  {name: 'first_name', type: 'first_name_en'},
  {name: 'last_name', type: 'last_name_en'},
  {name: 'brithday', type: 'date'},
  {name: 'country', type: 'country'},
  {name: 'address', type: 'china_region'},
  {name: 'ip', type: 'ip'}
]};

const requireFields = (...names) => data => {
  return names.reduce((errors, name) => {
    if (!data[name]) {
      errors[name] = 'Required';
    }
    return errors;
  }, {});
};

function validate(data) {
  const errors = {};
  if(!data.rows)
    errors.rows = 'Required';
  if(!data.format)
    errors.format = 'Required';
  errors.fields = _.map(data.fields, requireFields('name', 'type'));
  return errors;
}

@asyncConnect([{
  promise: ({store: {dispatch, getState}})=> {
    let promises = [];
    if(!getState().gen || getState().gen.fieldsMeta.length < 1) {
      let action = GenActions.fetchFieldsMeta();
      dispatch(action);
      promises.push(action.payload);
    }
    return Promise.all(promises);
  }
}])
@connect(
  state => ({gen: state.gen}),
  GenActions
)
export default class Gen extends Component {
  static propTypes = {
    gen: PropTypes.object.isRequired,
  };

  render() {
    let initialValues = INITIAL_VALUES;
    if(this.props.location.query && this.props.location.query.q) {
      initialValues = JSON.parse(this.props.location.query.q);
    }
    let extraFields = _.uniq(_.flatten(_.map(_.values(this.props.gen.fieldsMeta), (m)=> {
      return _.map(m.params, (p)=> `fields[].${p.name}`);
    })));
    let fields = ['rows', 'format', 'fields[].name', 'fields[].type'].concat(extraFields);
    return (
      <GenForm form="genForm" validate={validate} fields={fields}
        initialValues={initialValues} {...this.props} />
    );
  }
}
