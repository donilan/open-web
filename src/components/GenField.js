import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import {Input, ListGroupItem, Button, ButtonGroup, Modal} from 'react-bootstrap';

const cardSource = {
  beginDrag(props) {
    return {
      field: props.field
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveField(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}
class GenField extends Component {
  static propTypes = {
    field: PropTypes.any.isRequired,
    index: PropTypes.any.isRequired,
    fieldsMeta: PropTypes.any.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    moveField: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {dialogOpen: false};
  }

  getFieldMeta(){
    return this.props.fieldsMeta && this.props.fieldsMeta[this.props.field.type.value];
  }

  renderDialog() {
    let meta = this.getFieldMeta();
    if(!meta)
      return null;
    let inputs = _.map(meta.params, (p, i)=>{
      let type = {
        integer: 'number',
        bool: 'checkbox',
        boolean: 'checkbox',
        string: 'text',
        date: 'text',
        array: 'text',
        choice: 'select'
      }[p.type];
      let f = this.props.field[p.name];
      let input = null;
      if(p.type === 'choice') {
        input = (
          <Input type={type} value={f.value || p.default} {...f} >
            {_.keys(p.options).map((k)=> <option value={k} key={k}>{p.options[k]}</option>)}
          </Input>
        );
      } else {
        input = <Input type={type} value={f.value || p.default} {...f} />;
      }
      return (
        <div className="row" key={i}>
          <div className="col-xs-5">
            <label>{p.desc}</label>
          </div>
          <div className="col-xs-7">
            {input}
          </div>
        </div>
      );
    });
    return (
      <Modal show={this.state.dialogOpen} onHide={()=>this.setState({dialogOpen: false})}>
        <Modal.Header>
          <Modal.Title>Config for {meta.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {inputs}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={()=>this.setState({dialogOpen: false})}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderConfigBtn(){
    let meta = this.getFieldMeta();
    return (
      <Button bsStyle="primary" bsSize="small" disabled={!meta || !meta.params}
        onClick={()=>this.setState({dialogOpen: true})}>Config</Button>
    );
  }

  render() {
    const {field: {name, type}, index, fieldsMeta, isDragging, connectDragSource,
           connectDropTarget} = this.props;
    return connectDropTarget(connectDragSource(
      <div className="row field" style={{ opacity: isDragging ? 0 : 1 }}>
        <div className="col-xs-1">{index+1}</div>
        <div className="col-xs-3">
          <Input type="text" bsStyle={name.error ? 'error': null} {...name} />
        </div>
        <div className="col-xs-4">
          <Input type="select" {...type} value={type.value || ''}
            bsStyle={type.error ? 'error': null}>
          <option></option>
          {_.map(_.keys(fieldsMeta), (key)=>{
            return <option key={key} value={key}>{fieldsMeta[key].desc}</option>;
           })}
            </Input>
        </div>
        <div className="col-xs-3">
          <ButtonGroup>
            {this.renderConfigBtn()}
            <Button bsStyle="danger" bsSize="small"
              onClick={(e)=> this.props.removeField(e, index)} >Remove</Button>
          </ButtonGroup>
        </div>
        {this.renderDialog()}
      </div>
    ));
  }
}
export default DropTarget('GenField', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource('GenField', cardSource, collect)(GenField)
);
