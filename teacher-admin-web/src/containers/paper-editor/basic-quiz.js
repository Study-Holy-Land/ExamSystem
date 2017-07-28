import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import BasicQuiz from '../../components/paper-editor/basic-quiz';

function mapDispatchToProps(dispatch) {
  return {
    onRemoveHomeworkQuiz: (data) => {
      dispatch({type: 'REMOVE_HOMEWORK_QUIZ', data});
    },
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BasicQuiz));
