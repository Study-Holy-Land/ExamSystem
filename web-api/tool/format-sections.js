function formatLogicQuiz(section) {
  const items = {
    easyCount: section.quizzes.easy,
    normalCount: section.quizzes.normal,
    hardCount: section.quizzes.hard,
    exampleCount: (section.quizzes.example ? section.quizzes.example : 1)
  };
  return {type: 'blankQuizzes', description: section.title, items};
}

function formatHomeworkQuiz(section) {
  return {type: 'homeworkQuizzes', description: section.title, items: section.quizzes};
}

function formatBasicQuiz(section) {
  return {type: 'basicQuizzes', description: section.title, items: section.quizzes};
}

const mapperSections = {
  'logicQuiz': formatLogicQuiz,
  'homeworkQuiz': formatHomeworkQuiz,
  'basicQuiz': formatBasicQuiz
};

function formatSections(sections) {
  return sections.map(section => mapperSections[section.type](section));
}

module.exports = formatSections;
