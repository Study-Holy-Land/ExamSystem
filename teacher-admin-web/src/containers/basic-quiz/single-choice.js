import {connect} from 'react-redux';
import SingleChoice from '../../components/basic-quiz/single-choice';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    updateQuiz: (data) => {
      dispatch({type: 'UPDATE_QUIZ', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleChoice);
