var {QuizItem} = require('../../models/quizItem');
var {QuizSubmit} = require('../../models/quiz-submit');
var async = require('async');
var constant = require('../../mixin/constant');
const apiRequest = require('../api-request');

const deadline = 20;

class PaperHomeworkQuizHandler {
  bulkFindOrCreate(section, callback) {
    async.waterfall([
      (done) => {
        async.map(section.quizzes, (quiz, cb) => {
          apiRequest.get(quiz.definition_uri, (err, resp) => {
            if (err) {
              cb(err, null);
            }
            let {homeworkName, evaluateScript, templateRepository, createTime, description, id, type, uri, answerPath} = resp.body;

            QuizItem.findOrCreateHomework({id: id}, {
              homeworkName,
              evaluateScript,
              templateRepository,
              createTime,
              description,
              id,
              type,
              uri,
              answerPath
            }, (err, doc) => {
              cb(err, {quizId: doc.toJSON()._id});
            });
          });
        }, done);
      }
    ], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, Object.assign({}, {quizIds: result}, {sectionId: section.id}, {sectionName: section.description}));
      }
    });
  }

  getStatus(section, callback) {
    let result = {type: 'HomeworkQuiz', sectionId: section._id, firstQuizId: section.quizzes[0]._id};
    if (!section.startTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.NOTSTART}));
    }
    let times = parseInt(new Date().getTime() / constant.time.MILLISECOND_PER_SECONDS);
    let currentTime = convertMillsecondToDay(times);
    let startTime = convertMillsecondToDay(parseInt(section.startTime));
    let isTimeout = currentTime - startTime > deadline;

    if (isTimeout) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.TIMEOUT}));
    }
    if (section.quizzes.some(item => item.submits.length === 0)) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.INCOMPLETE}));
    }

    const items = section.quizzes;
    const submitId = items[items.length - 1].submits[items[items.length - 1].submits.length - 1];
    findHomeworkStatus(submitId, (err, status) => {
      if (err) {
        callback(null, null);
      }
      return callback(null, Object.assign({}, result, {status}));
    });
  }

  getIds(section, callback) {
    let result = section.quizzes.map(quiz => {
      return {id: quiz._id, homeworkName: quiz.quizId.homeworkName};
    });
    async.map(section.quizzes, (quiz, cb) => {
      let index = section.quizzes.indexOf(quiz);
      if (quiz.submits.length === 0) {
        cb(null, Object.assign(result[index], {status: 1}));
      } else {
        const homeworkScoringId = quiz.submits[quiz.submits.length - 1].homeworkScoringId;
        QuizSubmit.findOne({homeworkScoringId}).populate('homeworkScoringId')
            .exec((err, docs) => {
              if (err) {
                cb(err, null);
              }
              cb(null, Object.assign({}, result[index], {status: docs.homeworkScoringId.status}));
            });
      }
    }, (err, result) => {
      result = result.map((item, index) => {
        if (item.status === 1 && (index === 0 || result[index - 1].status === 4)) {
          return Object.assign({}, item, {status: 2});
        }
        return item;
      });
      callback(err, result);
    });
  }
}

function convertMillsecondToDay(millsecond) {
  return millsecond /
      (constant.time.SECONDS_PER_MINUTE *
      constant.time.MINUTE_PER_HOUR *
      constant.time.HOURS_PER_DAY *
      constant.time.MILLISECOND_PER_SECONDS);
}

function findHomeworkStatus(_id, callback) {
  QuizSubmit.findById(_id).populate('homeworkScoringId').exec((err, doc) => {
    if (err) {
      callback(null, null);
    }
    if (doc.homeworkScoringId.status === 4) {
      callback(null, constant.sectionStatus.COMPLETE);
    } else {
      callback(null, constant.sectionStatus.INCOMPLETE);
    }
  });
}

module.exports = PaperHomeworkQuizHandler;
