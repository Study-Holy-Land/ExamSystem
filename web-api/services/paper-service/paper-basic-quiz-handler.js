var constant = require('../../mixin/constant');
var {QuizItem} = require('../../models/quizItem');
var async = require('async');
const apiRequest = require('../api-request');

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

  bulkFindOrCreate(section, callback) {
    async.waterfall([
      (done) => {
        async.map(section.quizzes, (quiz, cb) => {
          apiRequest.get(quiz.definition_uri, (err, resp) => {
            if (err) {
              cb(err, null);
            }
            let {id, description, type, answer, options} = resp.body;
            let data = {};
            if (options) {
              options = options.split(',');
              data = {id, description, type, answer, options};
            } else {
              data = {id, description, type, answer};
            }
            QuizItem.findOrCreateBasic({id, type}, data, (err, doc) => {
              cb(err, {quizId: doc.toJSON()._id});
            });
          });
        }, done);
      }
    ], (err, doc) => {
      const result = Object.assign({}, {quizIds: doc}, {sectionId: section.id}, {sectionName: section.description});
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

}

module.exports = PaperBasicQuizHandler;
