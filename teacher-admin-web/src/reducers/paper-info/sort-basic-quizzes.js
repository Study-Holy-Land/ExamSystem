const sortBasicQuizzes = (data, {basicQuizzes, dragIndex, hoverIndex, sectionIndex}) => {
  data.sections.map((item) => {
    if (item.type === 'logicQuiz') {
      sectionIndex++;
    }
  });

  let sortBasicQuizzes = data.sections[sectionIndex].quizzes;
  const dragCard = sortBasicQuizzes[dragIndex];

  let newData = Object.assign({}, data);
  sortBasicQuizzes[dragIndex] = 'flag';
  if (hoverIndex < dragIndex) {
    sortBasicQuizzes.splice(hoverIndex, 0, dragCard);
  } else if (hoverIndex > dragIndex) {
    sortBasicQuizzes.splice(hoverIndex + 1, 0, dragCard);
  }

  sortBasicQuizzes = sortBasicQuizzes.filter((item) => {
    return item !== 'flag';
  });
  newData.sections[sectionIndex].quizzes = sortBasicQuizzes;

  return newData;
};

export default sortBasicQuizzes;
