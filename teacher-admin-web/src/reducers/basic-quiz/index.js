import initBasicQuiz from './init-basic-quiz';
import addQuiz from './add-quiz';
import updateQuiz from './update-quiz';
import deleteQuiz from './delete-quiz';

const actionMap = {
  'INIT_BASIC_QUIZ': initBasicQuiz,
  'ADD_QUIZ': addQuiz,
  'UPDATE_QUIZ': updateQuiz,
  'DELETE_QUIZ': deleteQuiz
};

function basicQuiz(state = [], action) {
  const func = actionMap[action.type];

  if (!func) {
    return state;
  }
  return func(state, action.data);
}
export default basicQuiz;
