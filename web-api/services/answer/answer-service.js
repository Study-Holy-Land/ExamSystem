var mongoose = require('mongoose');
var Message = require('../../models/messages');
var Paper = require('../../models/paper');
var async = require('async');

class AnswerService {

  getAnswerPath({from, type, to, deeplink}, callback) {
    async.waterfall([
      (done) => {
        Message.findOne({from, type, to, deeplink}, done);
      },
      (data, done) => {
        let id = mongoose.Types.ObjectId(deeplink);
        if (data) {
          Paper.aggregate()
            .unwind('$sections')
            .unwind('$sections.quizzes')
            .match({'sections.quizzes._id': id})
            .exec(done);
        } else {
          done(true, null);
        }
      },
      (doc, done) => {
        Paper.populate(doc, 'sections.quizzes.quizId', done);
      },
      (data, done) => {
        const answerPath = data[0].sections.quizzes.quizId.answerPath.split('/');
        done(null, answerPath[2]);
      }
    ], callback);
  }
}

module.exports = AnswerService;
