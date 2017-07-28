const deleteSection = (data, sectionIndex) => {
  let newData = Object.assign({}, data);

  let homeworkQuizzes = newData.sections.filter(section => section.type !== 'logicQuiz');
  homeworkQuizzes.splice(sectionIndex, 1);

  let logicQuizzes = newData.sections.filter(section => section.type === 'logicQuiz');
  newData.sections = logicQuizzes.concat(homeworkQuizzes);

  return newData;
};

export default deleteSection;
