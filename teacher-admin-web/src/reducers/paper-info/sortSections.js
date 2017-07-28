const sortSections = (data, {dragIndex, hoverIndex}) => {
  let newData = Object.assign({}, data);

  newData.sections.map((item) => {
    if (item.type === 'logicQuiz') {
      dragIndex++;
      hoverIndex++;
    }
  });

  const dragCard = newData.sections[dragIndex];
  newData.sections[dragIndex] = 'flag';

  if (hoverIndex < dragIndex) {
    newData.sections.splice(hoverIndex, 0, dragCard);
  } else if (hoverIndex > dragIndex) {
    newData.sections.splice(hoverIndex + 1, 0, dragCard);
  }

  newData.sections = newData.sections.filter((item) => {
    return item !== 'flag';
  });
  return newData;
};

export default sortSections;
