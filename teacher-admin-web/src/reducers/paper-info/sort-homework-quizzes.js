const sortHomeworkQuizzes = (data, {homeworkQuizzes, dragIndex, hoverIndex, sectionIndex}) => {
  data.sections.map((item) => {
    if (item.type === 'logicQuiz') {
      sectionIndex++;
    }
  });
  let sortHomeworkQuizzes = data.sections[sectionIndex].quizzes;
  const dragCard = sortHomeworkQuizzes[dragIndex];

  let newData = Object.assign({}, data);
  sortHomeworkQuizzes[dragIndex] = 'flag';
  if (hoverIndex < dragIndex) {
    sortHomeworkQuizzes.splice(hoverIndex, 0, dragCard);
  } else if (hoverIndex > dragIndex) {
    sortHomeworkQuizzes.splice(hoverIndex + 1, 0, dragCard);
  }

  sortHomeworkQuizzes = sortHomeworkQuizzes.filter((item) => {
    return item !== 'flag';
  });
  newData.sections[sectionIndex].quizzes = sortHomeworkQuizzes;

  return newData;
};

export default sortHomeworkQuizzes;
