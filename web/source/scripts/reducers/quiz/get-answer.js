const isExistSection = (quizzes, quizId) => {
  return quizzes.find((quizz, index) => {
    return quizz._id === quizId;
  });
};

const passLastAnswer = (data, newData) => {
  let newQuiz = Object.assign({}, data);
  let sections = newQuiz.paperInfo.sections || [];
  sections.map((section, index) => {
    let quiz = isExistSection(section.quizzes, newData.quizId);
    if (quiz) {
      newQuiz.userAnswer = newData.userAnswer;
    }
  });
  return newQuiz;
};

export default passLastAnswer;
