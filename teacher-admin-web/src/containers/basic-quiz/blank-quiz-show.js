import {connect} from 'react-redux';
import BasicBlankQuizShow from '../../components/basic-quiz/basic-blank-quiz-show';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    deleteBlankQuiz: (data) => {
      dispatch({type: 'DELETE_QUIZ', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicBlankQuizShow);
