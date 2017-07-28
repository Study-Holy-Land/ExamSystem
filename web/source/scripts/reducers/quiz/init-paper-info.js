const initPaperInfo = (data, newData) => {
  let quiz = Object.assign({}, data);
  quiz.paperInfo = newData;
  return quiz;
};

export default initPaperInfo;
