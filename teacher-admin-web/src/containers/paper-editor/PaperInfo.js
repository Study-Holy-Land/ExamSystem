import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import PaperInfo from '../../components/paper-editor/PaperInfo';

const mapStateToProps = ({paperInfo}) => {
  return {
    paperName: paperInfo.paperName,
    description: paperInfo.description,
    programId: paperInfo.programId

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PaperInfo));
