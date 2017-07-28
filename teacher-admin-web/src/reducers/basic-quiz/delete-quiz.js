const deleteQuiz = (data, quizIndex) => {
  return data.filter((item, index) => {
    return index !== quizIndex;
  });
};

export default deleteQuiz;
