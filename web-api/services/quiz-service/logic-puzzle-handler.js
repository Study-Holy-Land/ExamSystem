const config = require('config');
const OperateHandler = require('./OperateHandler');
const constant = require('../../mixin/constant');
const _timeBase = 90;

class LogicPuzzleHandler extends OperateHandler {
  check(quizzes) {
    return (quizzes.quizId.__t === 'LogicPuzzle');
  }

  subHandle(quizzes, callback) {
    let userAnswer = quizzes.submits.length === 0 ? '' : quizzes.submits[quizzes.submits.length - 1].userAnswer;
    const logicPuzzle = {
      item: {
        id: quizzes.quizId.id,
        initializedBox: JSON.parse(quizzes.quizId.initializedBox),
        question: quizzes.quizId.question,
        description: JSON.parse(quizzes.quizId.description),
        chartPath: config.get('staticFileServer') + quizzes.quizId.chartPath,
        answer: quizzes.quizId.answer
      },
      userAnswer: quizzes.quizId.answer || userAnswer,
      isExample: !!quizzes.quizId.answer,
      info: quizzes.info
    };
    callback(null, logicPuzzle);
  }

  getStatus(section, callback) {
    let result = {type: 'LogicPuzzle', sectionId: section._id, firstQuizId: section.quizzes[0]._id};
    if (!section.startTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.NOTSTART}));
    }
    let TOTAL_TIME = _timeBase * constant.time.MINUTE_PER_HOUR;
    let startTime = section.startTime || Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    let now = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    let usedTime = now - startTime;
    if (section.endTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.COMPLETE}));
    }
    if (parseInt(TOTAL_TIME - usedTime) <= 0) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.TIMEOUT}));
    }
    return callback(null, Object.assign({}, result, {status: constant.sectionStatus.INCOMPLETE}));
  }
}

module.exports = LogicPuzzleHandler;
