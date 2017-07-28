const modifySectionName = (data, sectionInfo) => {
  let newData = Object.assign({}, data);
  newData.sections.map((item) => {
    if (item.type === 'logicQuiz') {
      sectionInfo.sectionIndex++;
    }
  });

  newData.sections[sectionInfo.sectionIndex].title = sectionInfo.sectionName;
  return newData;
};

export default modifySectionName;
