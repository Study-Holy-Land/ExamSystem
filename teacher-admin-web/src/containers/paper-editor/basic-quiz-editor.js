import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import BasicQuizEditor from '../../components/paper-editor/basic-quiz-editor';

function mapDispatchToProps(dispatch) {
  return {
    addBasicQuiz: (data) => {
      dispatch({type: 'ADD_BASIC_QUIZ', data});
    },
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BasicQuizEditor));
