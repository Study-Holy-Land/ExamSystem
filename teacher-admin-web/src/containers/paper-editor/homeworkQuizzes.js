import {connect} from 'react-redux';
import HomeworkQuizzes from '../../components/paper-editor/HomeworkQuizzes';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    onSortHomeworkQuizzes: (homeworkQuizzes, dragIndex, hoverIndex, sectionIndex) => {
      let data = {homeworkQuizzes, dragIndex, hoverIndex, sectionIndex};
      dispatch({type: 'SORT_HOMEWORK_QUIZZES', data});
    },
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkQuizzes);
