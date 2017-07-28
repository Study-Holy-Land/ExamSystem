import {connect} from 'react-redux';
import MultipleChoiceShow from '../../components/basic-quiz/multiple-choice-show';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    deleteBlankQuiz: (data) => {
      dispatch({type: 'DELETE_QUIZ', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MultipleChoiceShow);
