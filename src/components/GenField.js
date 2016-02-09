import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import {Input, ListGroupItem} from 'react-bootstrap';

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
  };

  render() {
    const {field: {name, type}, index, fieldsMeta, isDragging, connectDragSource,
           connectDropTarget} = this.props;
    return connectDropTarget(connectDragSource(
      <div className="row" style={{ opacity: isDragging ? 0 : 1 }}>
        <div className="col-xs-1">{index+1}</div>
        <div className="col-xs-2">
          <Input type="text" {...name} />
        </div>
        <div className="col-xs-2">
          <Input type="select" {...type} value={type.value || ''}>
          {_.map(_.keys(fieldsMeta), (key)=>{
            return <option key={key} value={key}>{fieldsMeta[key].desc}</option>;
           })}
            </Input>
        </div>
      </div>
    ));
  }
}
export default DropTarget('GenField', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource('GenField', cardSource, collect)(GenField)
);
