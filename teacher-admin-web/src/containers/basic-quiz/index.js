import BasicQuiz from '../../components/basic-quiz/index';
import {connect} from 'react-redux';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    initBasicQuiz: (data) => {
      dispatch({type: 'INIT_BASIC_QUIZ', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicQuiz);
