import editPaper from './editPaper';
import initPaperData from './initPaperData';
import addSection from './addSection';
import modifySectionName from './modifySectionName';
import updateLogicPuzzle from './updateLogicPuzzle';
import removeHomeworkQuiz from './removeHomeworkQuiz';
import editHomework from './addHomework';
import deleteSection from './deleteSection';
import replaceHomeworkQuiz from './replaceHomeworkQuiz';
import addBasicQuiz from './add-basic-quiz';
import sortBasicQuizzes from './sort-basic-quizzes';
import sortSections from './sortSections';
import sortHomeworkQuizzes from './sort-homework-quizzes';

const actionMap = {
  'EDIT_PAPER': editPaper,
  'ADD_SECTION': addSection,
  'INIT_PAPER_DATA': initPaperData,
  'EDIT_SECTION_NAME': modifySectionName,
  'UPDATE_LOGIC_PUZZLE': updateLogicPuzzle,
  'REMOVE_HOMEWORK_QUIZ': removeHomeworkQuiz,
  'EDIT_HOMEWORK': editHomework,
  'DELETE_SECTION': deleteSection,
  'REPLACE_HOMEWORK_QUIZ': replaceHomeworkQuiz,
  'ADD_BASIC_QUIZ': addBasicQuiz,
  'REPLACE_BASIC_QUIZ': replaceHomeworkQuiz,
  'SORT_BASIC_QUIZZES': sortBasicQuizzes,
  'SORT_SECTIONS': sortSections,
  'SORT_HOMEWORK_QUIZZES': sortHomeworkQuizzes
};

function paperInfo(state = {sections: [], isSaved: false}, action) {
  const func = actionMap[action.type];

  if (!func) {
    return state;
  }

  return func(state, action.data);
}
export default paperInfo;
