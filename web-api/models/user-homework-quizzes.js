'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constant = require('../mixin/constant');

var userHomeworkQuizzesSchema = Schema({
  userId: Number,
  paperId: Number,
  programId: Number,
  quizzes: [{
    id: Number,
    startTime: Number,
    userAnswerRepo: String,
    uri: String,
    branch: String,
    status: {
      type: Number,
      default: constant.homeworkQuizzesStatus.LOCKED
    },
    homeworkSubmitPostHistory: [{
      type: Schema.Types.ObjectId,
      ref: 'homeworkScoring'
    }]
  }]
});

userHomeworkQuizzesSchema.statics.initUserHomeworkQuizzes = function(userId, quizzes, programId, paperId, callback) {
  this.findOne({userId, programId, paperId}, (err, doc) => {
    if (err) {
      callback(err, null);
    } else if (doc) {
      callback(null, doc);
    } else {
      var _quizzes = quizzes.map((quiz) => {
        return {
          id: quiz.id,
          uri: quiz.definition_uri
        };
      });

      _quizzes[0].status = constant.homeworkQuizzesStatus.ACTIVE;

      this.create({
        userId: userId,
        paperId: paperId,
        programId: programId,
        quizzes: _quizzes
      }, callback);
    }
  });
};

userHomeworkQuizzesSchema.statics.getQuizStatus = function(userId, callback) {
  this.findOne({userId: userId})
    .exec((err, doc) => {
      return callback(err, doc.quizzes.map((item) => {
        return {status: item.status};
      }));
      // if (err || !doc) {
      //  callback(err || 'NOT_FOUND');
      // } else {
      //  var result = [];
      //
      //  doc.quizzes.forEach((item, index) => {
      //    var historyLength = item.homeworkSubmitPostHistory.length;
      //    // 如果有历史记录，则返回历史记录的状态
      //    if (historyLength) {
      //      result.push({
      //        status: item.homeworkSubmitPostHistory[historyLength - 1].status
      //      });
      //      // 如果是第一题，则直接解锁
      //    } else if (!index) {
      //      result.push({
      //        status: constant.homeworkQuizzesStatus.ACTIVE
      //      });
      //      // 如果上一题已经成功，则直接解锁
      //    } else if (doc.quizzes[index - 1].homeworkSubmitPostHistory.length) {
      //      var lastStatus = doc.quizzes[index - 1].homeworkSubmitPostHistory.pop().status;
      //
      //      if (lastStatus === constant.homeworkQuizzesStatus.SUCCESS) {
      //        result.push({
      //          status: constant.homeworkQuizzesStatus.ACTIVE
      //        });
      //      } else {
      //        result.push({
      //          status: constant.homeworkQuizzesStatus.LOCKED
      //        });
      //      }
      //      // 否则是锁
      //    } else {
      //      result.push({
      //        status: constant.homeworkQuizzesStatus.LOCKED
      //      });
      //    }
      //  });
      //
      //  callback(null, result);
      // }
    });
};

userHomeworkQuizzesSchema.statics.findProgressTasks = function(callback) {
  this.find({quizzes: {$elemMatch: {status: constant.homeworkQuizzesStatus.PROGRESS}}}, 'userId quizzes', (err, doc) => {
    if (err) {
      callback(err);
    } else {
      var result = [];

      doc.forEach((item) => {
        var userAnswerRepo;
        var quizId;
        item.quizzes.forEach((quiz) => {
          userAnswerRepo = quiz.status === constant.homeworkQuizzesStatus.PROGRESS ? quiz.userAnswerRepo : userAnswerRepo;
          quizId = quiz.status === constant.homeworkQuizzesStatus.PROGRESS ? quiz.id : quizId;
        });

        result.push({
          userId: item.userId,
          quizId: quizId,
          userAnswerRepo: userAnswerRepo
        });
      });

      callback(null, result);
    }
  });
};

userHomeworkQuizzesSchema.statics.checkDataForUpdate = function(userId, homeworkId, callback) {
  this.findOne({
    userId: userId,
    quizzes: {$elemMatch: {id: homeworkId}}
  }, {
    userId: 1,
    paperId: 1,
    quizzes: {$elemMatch: {id: homeworkId}}
  }, (err, data) => {
    if (err || !data) {
      callback(true);
    } else if (data.quizzes[0].status === constant.homeworkQuizzesStatus.PROGRESS) {
      callback(null, data);
    } else {
      callback(true);
    }
  });
};

userHomeworkQuizzesSchema.statics.updateQuizzesStatus = function(data, callback) {
  this.findOne({userId: data.userId}, (err, doc) => {
    if (err || !doc) {
      callback(true);
    } else {
      doc.quizzes.forEach((item, i) => {
        if (item.id === data.homeworkId) {
          var status = data.resultStatus ? constant.homeworkQuizzesStatus.SUCCESS : constant.homeworkQuizzesStatus.ERROR;
          doc.quizzes[i].status = status;
          doc.quizzes[i].homeworkSubmitPostHistory[doc.quizzes[i].homeworkSubmitPostHistory.length - 1].status = status;
          doc.quizzes[i].homeworkSubmitPostHistory[doc.quizzes[i].homeworkSubmitPostHistory.length - 1].resultURL = data.resultURL;
          doc.quizzes[i].homeworkSubmitPostHistory[doc.quizzes[i].homeworkSubmitPostHistory.length - 1].homeworkDetail = data.homeworkDetail;
        }
      });
      doc.save(callback);
    }
  });
};

userHomeworkQuizzesSchema.statics.updateStatus = function(data, callback) {
  var historyId = new mongoose.Types.ObjectId(data.historyId);
  this.findOne({'quizzes.homeworkSubmitPostHistory': historyId}, (err, doc) => {
    if (err) {
      callback(err, null);
    }
    var nextIdx = 0;

    var theQuiz = doc.quizzes.find((item, idx) => {
      nextIdx = idx + 1;
      return item.homeworkSubmitPostHistory.indexOf(historyId) > -1;
    });

    var nextQuiz = doc.quizzes[nextIdx];

    if (constant.homeworkQuizzesStatus.SUCCESS === data.status && nextQuiz) {
      nextQuiz.status = constant.homeworkQuizzesStatus.ACTIVE;
    }
    theQuiz.status = data.status;
    doc.save(function(err, data) {
      callback(err, data);
    });
  });
};

module.exports = mongoose.model('UserHomeworkQuizzes', userHomeworkQuizzesSchema);
