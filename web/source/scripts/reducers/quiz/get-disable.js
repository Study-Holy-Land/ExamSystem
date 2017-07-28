import constant from '../../../../mixin/constant';

const getDisable = (data, newData) => {
  const newQuiz = Object.assign({}, data);
  const sections = newData.sections || [];
  const sectionStatus = constant.sectionStatus;
  const newSections = sections.map((section, index) => {
    let preSection = sections[index - 1] || {status: 1};
    let preStatus = preSection.status;

    let isDisable = (section.status === sectionStatus.INCOMPLETE || section.status === sectionStatus.NOTSTART) &&
      (preStatus === sectionStatus.COMPLETE || preStatus === sectionStatus.TIMEOUT);

    if (newQuiz.paperInfo.program.type === 'practice') {
      isDisable = section.quizzes.find((quiz) => {
        return quiz._id === newData.quizId;
      });
    }
    return Object.assign({}, section, {isDisable});
  });

  newQuiz.paperInfo.sections = newSections;

  return newQuiz;
};

export default getDisable;
