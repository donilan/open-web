import React, { Component, PropTypes } from 'react';
import {reduxForm, addArrayValue} from 'redux-form';
import {fetchData} from '../actions/gen';
import {Button, Table, Input, ListGroup, ListGroupItem} from 'react-bootstrap';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import _ from 'lodash';
import GenField from './GenField';

class Gen extends Component {
  static propTypes = {
    gen: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.fetchFieldsMeta();
  }

  renderPreview() {
    if(this.props.gen.data.length > 0) {
      var result = _.join(this.props.gen.data, "\n")
      return <pre>{result}</pre>;
    }
    return null;
  }

  moveField(dragIndex, hoverIndex) {
    this.props.fields.fields.swapFields(dragIndex, hoverIndex);
  }

  render() {
    const {fields: {fields, rows, format}, handleSubmit} = this.props;
    var fieldRows = _.map(fields, (f, i)=> {
      return <GenField key={i} field={f} index={i} fieldsMeta={this.props.gen.fieldsMeta}
             moveField={this.moveField.bind(this)}/>;
    });

    return (
      <div className="container">
        <form onSubmit={handleSubmit(fetchData)}>
          <div className="row">
            <div className="col-xs-1">
              <Button bsStyle="success" bsSize="xsmall" type="button"
                onClick={fields.addField}>ADD</Button>
            </div>
            <div className="col-xs-2">Field Name</div>
            <div className="col-xs-2">Field Type</div>
          </div>
          {fieldRows}
          <div className="row">
            <div className="col-xs-4">
              <Input type="text" addonBefore="# Rows"
                buttonAfter={<Button bsStyle="primary"
                             type="submit" value="preview">Preview</Button>}
                                                                    {...rows} />
            </div>
            <div className="col-xs-4">
              <Input type="text" addonBefore="Format" disabled={true}
                buttonAfter={<Button bsStyle="primary"
                             type="submit" value="download" disabled={true}>Download</Button>}
                                                                      {...format} />
            </div>
          </div>
        </form>
        {this.renderPreview()}
      </div>
    );
  }
}

const GenForm = reduxForm({
  form: 'genForm',
  fields: ['rows', 'format', 'fields[].name', 'fields[].type', 'fields[].options'],
  initialValues: {rows: 100, format: 'JSON', fields: [
    {name: 'id', type: 'id'},
    {name: 'uuid', type: 'uuid'},
    {name: 'brithday', type: 'date'},
  ]}
})(Gen);

export default DragDropContext(HTML5Backend)(GenForm);
