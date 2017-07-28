import {connect} from 'react-redux';
import MultipleChoice from '../../components/basic-quiz/multiple-choice';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    updateQuiz: (data) => {
      dispatch({type: 'UPDATE_QUIZ', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MultipleChoice);
