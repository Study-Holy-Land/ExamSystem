import QuizAddButton from '../../components/paper-editor/QuizAddButton';
import {connect} from 'react-redux';

const mapStateToProps = ({paperInfo, stacks}) => {
  let sections;

  if (paperInfo.sections) {
    sections = paperInfo.sections.filter(section => section.type !== 'logicQuiz');
  }
  return {sections, stacks};
};

const mapDispatchToProps = (dispatch) => {
  return {
    editHomework: (quizzes) => {
      dispatch({
        type: 'EDIT_HOMEWORK',
        data: quizzes
      });
    },
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizAddButton);
