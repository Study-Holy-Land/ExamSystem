const editHomework = (data, newQuizzes) => {
  let newData = Object.assign({}, data);
  const sectionIndex = newQuizzes.sectionIndex;
  let rowSection = newData.sections.filter(section => section.type !== 'logicQuiz');
  let quizzes = rowSection[sectionIndex].quizzes.concat(newQuizzes.quizzes);
  rowSection[sectionIndex].quizzes = quizzes;
  return newData;
};

export default editHomework;
