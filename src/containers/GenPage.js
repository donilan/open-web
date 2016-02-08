import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Gen from '../components/Gen';
import * as GenActions from '../actions/gen';


function mapStateToProps(state) {
  return {
    gen: state.gen
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(GenActions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Gen);
