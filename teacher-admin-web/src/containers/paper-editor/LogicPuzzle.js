import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import LogicPuzzle from '../../components/paper-editor/LogicPuzzle';

function getToggle(paperInfo) {
  return paperInfo.sections.filter((item) => {
    return item.type === 'logicQuiz';
  }).length > 0;
}

function getQuizzes(paperInfo) {
  let result = paperInfo.sections.filter((item) => {
    return item.type === 'logicQuiz';
  })[0] || {};

  return result.quizzes || {};
}
const mapStateToProps = ({paperInfo}) => ({
  toggleStatus: getToggle(paperInfo),
  quizzes: getQuizzes(paperInfo)
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateLogicPuzzle: (data) => {
      dispatch({type: 'UPDATE_LOGIC_PUZZLE', data});
    },
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LogicPuzzle));
