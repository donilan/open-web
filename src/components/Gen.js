import React, { Component, PropTypes } from 'react';
import {reduxForm, addArrayValue} from 'redux-form';
import {fetchData} from '../actions/gen';
import {Button, Table, Input} from 'react-bootstrap';

import _ from 'lodash';

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

  render() {
    const {fields: {fields, rows, format}, handleSubmit} = this.props;
    var fieldRows = _.map(fields, (f, i)=> {
      return (
        <tr key={i}>
          <td>
            <Input type="text" {...f.name} />
          </td>
          <td>
            <Input type="select" {...f.type} value={f.type.value || ''}>
              {_.map(_.keys(this.props.gen.fieldsMeta), (key)=>{
                return <option key={key} value={key}>{this.props.gen.fieldsMeta[key].desc}</option>;
               })}
            </Input>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <form onSubmit={handleSubmit(fetchData)}>
          <Table>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Field Type</th>
              </tr>
            </thead>
            <tbody>
              {fieldRows}
            </tbody>
          </Table>
          <div>
            <Button bsStyle="primary" type="button" onClick={fields.addField}>Add Field</Button>
          </div>
          <div>
            Rows: <Input type="text" {...rows}
                    buttonAfter={<Button bsStyle="primary" type="submit">submit</Button>} />
          </div>
        </form>
        {this.renderPreview()}
      </div>
    );
  }
}

export default reduxForm({
  form: 'genForm',
  fields: ['rows', 'format', 'fields[].name', 'fields[].type', 'fields[].options'],
  initialValues: {rows: 100, format: 'json', fields: [
    {name: 'id', type: 'id'},
    {name: 'uuid', type: 'uuid'},
    {name: 'brithday', type: 'date'},
  ]}
})(Gen);
