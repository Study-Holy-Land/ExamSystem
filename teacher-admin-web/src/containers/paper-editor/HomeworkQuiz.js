import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import HomeworkQuiz from '../../components/paper-editor/HomeworkQuiz';

function mapDispatchToProps(dispatch) {
  return {
    onRemoveHomeworkQuiz: (data) => {
      dispatch({type: 'REMOVE_HOMEWORK_QUIZ', data});
    },
    onReplaceHomeworkQuiz: (data) => {
      dispatch({type: 'REPLACE_HOMEWORK_QUIZ', data});
    },
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
}

const mapStateToProps = (state) => {
  return {
    stacks: state.stacks,
    sections: state.paperInfo.sections
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomeworkQuiz));
