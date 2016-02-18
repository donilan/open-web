import React, { Component, PropTypes } from 'react';
import {reduxForm, addArrayValue} from 'redux-form';
import {fetchData, fetchDataUrl} from '../actions/gen';
import {Button, Table, Input, ListGroup, ListGroupItem, ButtonGroup} from 'react-bootstrap';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import _ from 'lodash';
import GenField from './GenField';


class GenForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {shareLink: null, apiLink: null};
  }

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
  handleShareLink(fields) {
    this.setState({
      shareLink: encodeURI(`${window.location.origin}${window.location.pathname}?q=${JSON.stringify(fields)}`)
    });
  }
  handleApiLink(fields) {
    this.setState({apiLink: encodeURI(fetchDataUrl(fields, fields.format))});
  }
  renderButtons(handleSubmit, rows, format) {
    return (
      <div className="row">
        <div className="col-xs-2">
          <Input type="text" addonBefore="# Rows" bsStyle={rows.error ? 'error' : null}
            {...rows} />
        </div>
        <div className="col-xs-3">
          <Input type="select" addonBefore="Format" bsStyle={format.error ? 'error' : null}
            {...format} >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </Input>
        </div>
        <div className="col-xs-5">
          <ButtonGroup>
            <Button bsStyle="primary" onClick={handleSubmit(this.handleDownload)}
              type="submit" value="download" >Download</Button>
            <Button onClick={handleSubmit(fetchData)}
              type="submit" value="preview">Preview</Button>
            <Button onClick={handleSubmit(this.handleShareLink.bind(this))} >Share</Button>
            <Button onClick={handleSubmit(this.handleApiLink.bind(this))} >API</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }

  renderLink() {
    let shareLink = null;
    let apiLink = null;
    if(this.state.shareLink) {
      shareLink = (
        <div className="col-xs-12">
          <Input type="text" addonBefore="Share" disabled={true} value={this.state.shareLink} />
        </div>
      );
    }
    if(this.state.apiLink) {
      apiLink = (
        <div className="col-xs-12">
          <Input type="text" addonBefore="API" disabled={true} value={this.state.apiLink} />
        </div>
      );
    }
    return (
      <div className="row">
        {shareLink}
        {apiLink}
      </div>
    );
  }

  render() {
    const {fields: {fields, rows, format}, handleSubmit} = this.props;
    var fieldRows = _.map(fields, (f, i)=> {
      return <GenField key={i} field={f} index={i} fieldsMeta={this.props.gen.fieldsMeta}
             moveField={this.moveField.bind(this)} removeField={this.removeField.bind(this)}/>;
    });

    return (
      <div className="container generator">
        <form >
          <div className="row field-headers">
            <div className="col-xs-1">
              #
            </div>
            <div className="col-xs-3">Field Name</div>
            <div className="col-xs-4">Field Type</div>
            <div className="col-xs-3">Options</div>
          </div>
          {fieldRows}
          <Button type="button"
            onClick={(e)=>{fields.addField({name: `field_${fields.length+1}`})}}>
            Add Another Field
          </Button>

          <hr />
          {this.renderButtons(handleSubmit, rows, format)}
          <hr />
          {this.renderLink()}
        </form>
        {this.renderPreview()}
      </div>
    );
  }
}

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

const INITIAL_VALUES = {rows: 50, format: 'json', fields: [
  {name: 'id', type: 'row_number'},
  {name: 'email', type: 'email'},
  {name: 'gender', type: 'gender'},
  {name: 'first_name', type: 'first_name_en'},
  {name: 'last_name', type: 'last_name_en'},
  {name: 'brithday', type: 'date'},
  {name: 'country', type: 'country'},
  {name: 'address', type: 'china_region'}
]};

const DndReduxGenForm = DragDropContext(HTML5Backend)(reduxForm({})(GenForm));
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
    let initialValues = INITIAL_VALUES;
    if(this.props.location.query.q) {
      initialValues = JSON.parse(this.props.location.query.q);
    }
    let extraFields = _.uniq(_.flatten(_.map(_.values(meta), (m)=> {
      return _.map(m.params, (p)=> `fields[].${p.name}`);
    })));
    let fields = ['rows', 'format', 'fields[].name', 'fields[].type'].concat(extraFields);
    return <DndReduxGenForm form="genForm" validate={validate} fields={fields}
             initialValues={initialValues} {...this.props} />;
  }
}
