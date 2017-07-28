import editSections from './edit-sections';
import initPaperInfo from './init-paper-info';
import getAnswer from './get-answer';
import getDisable from './get-disable';

const actionMap = {
  'EDIT_PAPER': editSections,
  'INIT_PAPER_INFO': initPaperInfo,
  'GET_ANSWER': getAnswer,
  'GET_DISABLE': getDisable
};

function quiz (state = {sections: [], paperInfo: {}, userAnswer: '', basicQuiz: []}, action) {
  const func = actionMap[action.type];

  if (!func) {
    return state;
  }

  return func(state, action.data);
}
export default quiz;
