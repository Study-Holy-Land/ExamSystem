var constant = require('../../mixin/constant');

class PaperBasicQuizHandler {
  getStatus(section, callback) {
    let result = {type: 'BasicQuiz', sectionId: section._id, firstQuizId: section.quizzes[0]._id};
    if (!section.startTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.NOTSTART}));
    }
    if (section.endTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.COMPLETE}));
    }
    return callback(null, Object.assign({}, result, {status: constant.sectionStatus.INCOMPLETE}));
  }
}

module.exports = PaperBasicQuizHandler;
