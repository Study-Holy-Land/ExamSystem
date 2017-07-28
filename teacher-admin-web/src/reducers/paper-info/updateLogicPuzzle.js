const updateLogicPuzzle = (data, {quizzes}) => {
  let quizzesIndex = 0;
  let count = 0;

  for (let i = 0; i < data.sections.length; i++) {
    if (data.sections[i].type === 'logicQuiz') {
      quizzesIndex = i;
      count = 1;
      break;
    }
  }
  let newSection = quizzes ? {
    quizzes: quizzes,
    type: 'logicQuiz',
    title: 'blank'
  } : undefined;

  data.sections.splice(quizzesIndex, count, newSection);

  let result = Object.assign({}, data, {
    sections: data.sections.filter((item) => {
      return item !== undefined;
    })
  });
  return result;
};

export default updateLogicPuzzle;
