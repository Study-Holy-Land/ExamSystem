import {connect} from 'react-redux';
import BasicBlankQuiz from '../../components/basic-quiz/basic-blank-quiz';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    updateQuiz: (data) => {
      dispatch({type: 'UPDATE_QUIZ', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicBlankQuiz);
