import PaperEditor from '../../components/paper-editor/index';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

const mapStateToProps = ({paperInfo}) => {
  return {paperInfo};
};

function mapDispatchToProps(dispatch) {
  return {
    initPaperData: (data) => {
      dispatch({type: 'INIT_PAPER_DATA', data});
    },
    initStacks: (data) => {
      dispatch({type: 'INIT_STACKS', data});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PaperEditor));
