import React, { Component, PropTypes } from 'react';
import {reduxForm, addArrayValue} from 'redux-form';
import {fetchData, fetchDataUrl} from '../actions/gen';
import {Button, Table, Input, ListGroup, ListGroupItem} from 'react-bootstrap';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import _ from 'lodash';
import GenField from './GenField';


class GenForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  renderPreview() {
    if(this.props.gen.data) {
      return <pre>{this.props.gen.data}</pre>;
    }
    return null;
  }

  moveField(dragIndex, hoverIndex) {
    this.props.fields.fields.swapFields(dragIndex, hoverIndex);
  }
  removeField(e, index) {
    this.props.fields.fields.removeField(index);
  }

  handleDownload(fields) {
    let url = fetchDataUrl(fields, fields.format);
    window.open(url);
  }

  render() {
    const {fields: {fields, rows, format}, handleSubmit} = this.props;
    var fieldRows = _.map(fields, (f, i)=> {
      return <GenField key={i} field={f} index={i} fieldsMeta={this.props.gen.fieldsMeta}
             moveField={this.moveField.bind(this)} removeField={this.removeField.bind(this)}/>;
    });

    return (
      <div className="container">
        <form onSubmit={handleSubmit(fetchData)}>
          <div className="row">
            <div className="col-xs-1">
              <Button bsStyle="success" bsSize="xsmall" type="button"
                onClick={(e)=>{fields.addField({name: `field_${fields.length+1}`})}}>ADD</Button>
            </div>
            <div className="col-xs-2">Field Name</div>
            <div className="col-xs-4">Field Type</div>
            <div className="col-xs-4">Options</div>
          </div>
          {fieldRows}
          <div className="row">
            <div className="col-xs-4">
              <Input type="text" addonBefore="# Rows" bsStyle={rows.error ? 'error' : null}
                buttonAfter={<Button bsStyle="primary"
                             type="submit" value="preview">Preview</Button>}
                                                                    {...rows} />
            </div>
            <div className="col-xs-4">
              <Input type="select" addonBefore="Format" bsStyle={format.error ? 'error' : null}
                buttonAfter={<Button bsStyle="primary" onClick={handleSubmit(this.handleDownload)}
                             type="submit" value="download" >Download</Button>}
                {...format} >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                </Input>
            </div>
          </div>
        </form>
        {this.renderPreview()}
      </div>
    );
  }
}

const requireFields = (...names) => data =>
names.reduce((errors, name) => {
  if (!data[name]) {
    errors[name] = 'Required';
  }
  return errors;
}, {});

function validate(data) {
  const errors = {};
  if(!data.rows)
    errors.rows = 'Required';
  if(!data.format)
    errors.format = 'Required';
  errors.fields = _.map(data.fields, requireFields('name', 'type'));
  return errors;
}
const ReduxGenForm = reduxForm({
  form: 'genForm',
  /* fields: ['rows', 'format', 'fields[].name', 'fields[].type', 'fields[].options'], */
  validate,
  initialValues: {rows: 100, format: 'json', fields: [
    {name: 'id', type: 'row_number'},
    {name: 'uuid', type: 'uuid'},
    {name: 'first_name', type: 'first_name_en'},
    {name: 'last_name', type: 'last_name_en'},
    {name: 'brithday', type: 'date'},
  ]}
})(GenForm);

const DndReduxGenForm = DragDropContext(HTML5Backend)(ReduxGenForm);
export default class Gen extends Component {
  static propTypes = {
    gen: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.props.fetchFieldsMeta();
  }

  render() {
    let meta = this.props.gen.fieldsMeta;
    if(!meta)
      return <h1>Loading...</h1>;
    let extraFields = _.uniq(_.flatten(_.map(_.values(meta), (m)=> {
      return _.map(m.params, (p)=> `fields[].${p.name}`);
    })));
    let fields = ['rows', 'format', 'fields[].name', 'fields[].type'].concat(extraFields);
    return <DndReduxGenForm fields={fields} {...this.props} />;
  }
}
