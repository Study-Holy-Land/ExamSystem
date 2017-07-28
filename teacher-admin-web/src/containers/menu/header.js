import Header from '../../components/menu/Header';
import {logout} from '../../actions/logout/logout';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    exit: () => {
      dispatch(logout());
    },
    resetLogout: () => {
      dispatch({type: 'RESET_LOGOUT'});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
