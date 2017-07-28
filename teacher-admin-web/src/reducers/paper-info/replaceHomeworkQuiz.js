const replaceHomeworkQuiz = (data, newData) => {
  const sectionIndex = newData.sectionIndex;
  const homeworkQuizIndex = newData.homeworkQuizIndex;
  const quiz = newData.quiz;
  let sections = data.sections.filter(section => section.type !== 'logicQuiz');

  sections[sectionIndex].quizzes.splice(homeworkQuizIndex, 1, quiz);
  const logicSection = data.sections.filter(section => section.type === 'logicQuiz');

  sections = sections.concat(logicSection);

  return Object.assign({}, data, {sections});
};

export default replaceHomeworkQuiz;
