
import { connect } from 'react-redux';
import Gen from '../components/Gen';
import * as GenActions from '../actions/gen';


function mapStateToProps(state) {
  return {
    gen: state.gen
  };
}

export default connect(mapStateToProps, GenActions)(Gen);
