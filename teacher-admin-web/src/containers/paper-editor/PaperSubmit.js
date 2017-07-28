import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import PaperSubmit from '../../components/paper-editor/PaperSubmit';

const mapStateToProps = ({paperInfo}) => {
  return {data: paperInfo};
};

const mapDispatchToProps = (dispatch) => {
  return {
    initPaperData: (data) => {
      dispatch({type: 'INIT_PAPER_DATA', data});
    },
    addPaperId: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PaperSubmit));
