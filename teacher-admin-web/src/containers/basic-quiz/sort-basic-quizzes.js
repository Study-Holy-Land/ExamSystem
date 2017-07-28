import {connect} from 'react-redux';
import BasicQuizzes from '../../components/paper-editor/basic-quizzes';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    sortBasicQuizzes: (basicQuizzes, dragIndex, hoverIndex, sectionIndex) => {
      let data = {basicQuizzes, dragIndex, hoverIndex, sectionIndex};
      dispatch({type: 'SORT_BASIC_QUIZZES', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicQuizzes);
