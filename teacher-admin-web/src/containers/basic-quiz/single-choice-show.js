import {connect} from 'react-redux';
import SingleChoiceShow from '../../components/basic-quiz/single-choice-show';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    deleteBlankQuiz: (data) => {
      dispatch({type: 'DELETE_QUIZ', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleChoiceShow);
