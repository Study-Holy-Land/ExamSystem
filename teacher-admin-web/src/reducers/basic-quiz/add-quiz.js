const addQuiz = (data, blankQuiz) => {
  let newData = Object.assign([], data);
  newData.push(blankQuiz);
  return newData;
};

export default addQuiz;
