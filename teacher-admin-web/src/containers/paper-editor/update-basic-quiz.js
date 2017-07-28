import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import UpdateBasicQuiz from '../../components/paper-editor/update-basic-quiz';

function mapDispatchToProps(dispatch) {
  return {
    onReplaceBasicQuiz: (data) => {
      dispatch({type: 'REPLACE_BASIC_QUIZ', data});
    },
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UpdateBasicQuiz));
