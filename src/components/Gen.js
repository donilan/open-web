import React, { Component, PropTypes } from 'react';
import {reduxForm, addArrayValue} from 'redux-form';
import {fetchData} from '../actions/gen';

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
    console.log(this.props.gen.data);
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
            <input type="text" {...f.name} />
          </td>
          <td>
            <select {...f.type} value={f.type.value || ''}>
              {_.map(_.keys(this.props.gen.fieldsMeta), (key)=>{
                return <option key={key} value={key}>{this.props.gen.fieldsMeta[key].desc}</option>;
               })}
            </select>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <form onSubmit={handleSubmit(fetchData)}>
          <table>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Field Type</th>
              </tr>
            </thead>
            <tbody>
              {fieldRows}
            </tbody>
          </table>
          <div><button type="button" onClick={fields.addField}>Add Field</button></div>
          <div>
            Rows: <input type="text" {...rows} />
            <button type="submit">submit</button>
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
