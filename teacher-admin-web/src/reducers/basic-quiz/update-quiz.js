const updateQuiz = (data, {quiz, index}) => {
  let newData = Object.assign([], data);
  newData[index] = quiz;
  return newData;
};

export default updateQuiz;
