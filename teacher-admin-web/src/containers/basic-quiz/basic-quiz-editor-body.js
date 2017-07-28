import {connect} from 'react-redux';
import BasicQuizEditorBody from '../../components/basic-quiz/basic-quiz-editor-body';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return (
  {
    addQuiz: (data) => {
      dispatch({type: 'ADD_QUIZ', data});
    }
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicQuizEditorBody);
