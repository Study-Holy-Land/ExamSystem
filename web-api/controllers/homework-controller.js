'use strict';

var async = require('async');
var mongoose = require('mongoose');
var request = require('superagent');

var constant = require('../mixin/constant');
var apiRequest = require('../services/api-request');
const config = require('config');
var scoringService = require('../services/homework/scoring-service');
var quizService = require('../services/homework/quiz-service');
var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var homeworkScoring = require('../models/homework-scoring');
var AnswerService = require('../services/answer/answer-service');

function getDesc(status, realDesc) {
  if (status === constant.homeworkQuizzesStatus.LOCKED) {
    return '## 当前题目未解锁,请先完成之前的题目.';
  } else {
    return realDesc;
  }
}

function HomeworkController() {
}

HomeworkController.prototype.getList = (req, res, next) => {
  var userId = req.session.user.id;
  var id = req.params.id;
  userHomeworkQuizzes.findOne({userId: userId, _id: id}, (err, data) => {
    if (err) {
      return next(err);
    }

    res.send({
      status: constant.httpCode.OK,
      homeworkQuizzes: data.quizzes
    });
  });
};

HomeworkController.prototype.updateStatus = (req, res, next) => {
  var homewrok, homewrokIdx;
  async.waterfall([
    (done) => {
      var id = new mongoose.Types.ObjectId(req.params.historyId);
      userHomeworkQuizzes
        .aggregate([
          {'$unwind': '$quizzes'},
          {'$unwind': '$quizzes.homeworkSubmitPostHistory'}
        ])
        .match({'quizzes.homeworkSubmitPostHistory': id})
        .exec(done);
    },
    (data, done) => {
      if (!data.length) {
        done(new Error('没有找到相应资源：' + req.params.historyId), null);
      }
      homewrok = data[0];
      userHomeworkQuizzes.findOne(data[0]._id, done);
    },
    (data, done) => {
      var nextIdx;
      var quiz = data.quizzes.find((item, idx, doc) => {
        var match = item._id.toString() === homewrok.quizzes._id.toString();
        if (match) {
          homewrokIdx = idx;
          nextIdx = idx + 1;
        }
        return match;
      });
      quiz.status = parseInt(req.body.status) || 1;
      if (quiz.status === constant.homeworkQuizzesStatus.SUCCESS && data.quizzes[nextIdx]) {
        data.quizzes[nextIdx].status = constant.homeworkQuizzesStatus.ACTIVE;
      }
      data.save(done);
    },
    (data, numAffected, done) => {
      var homeworkQuiz = data.quizzes[homewrokIdx];
      var submited = req.body;
      submited.commitTime = parseInt(Date.parse(submited.createdAt) / constant.time.MILLISECOND_PER_SECONDS);
      done(null, {
        examerId: data.userId,
        paperId: data.paperId,
        homeworkSubmits: [{
          homeworkQuizId: homeworkQuiz.id,
          startTime: homeworkQuiz.startTime,
          homeworkSubmitPostHistory: [submited]
        }]
      });
    },
    (data, done) => {
      apiRequest.post('scoresheets', data, done);
    }
  ], (err, data) => {
    if (err) {
      return next(req, res, err);
    }
    res.send(data);
  });
};

HomeworkController.prototype.getOneQuiz = (req, res, next) => {
  var userId = req.session.user.id;
  var orderId = parseInt(req.query.orderId, 10) || 1;
  var id = req.query.id;
  var result = {};
  var histories;
  var answerService = new AnswerService();
  async.waterfall([
    (done) => {
      userHomeworkQuizzes.findOne({userId: userId, _id: id}, done);
    },
    (data, done) => {
      orderId = Math.max(orderId, 1);
      orderId = Math.min(orderId, data.quizzes.length);
      done(null, data);
    },
    (doc, done) => {
      var index = orderId - 1;
      var data = doc.quizzes[index];
      result.uri = data.uri;
      result.status = data.status;
      result.id = data.id;
      histories = data.homeworkSubmitPostHistory;
      if (!data.startTime && data.status !== constant.homeworkQuizzesStatus.LOCKED) {
        data.startTime = parseInt(new Date() / constant.time.MILLISECOND_PER_SECONDS);
        doc.save(() => {
          done(null, histories);
        });
      } else {
        done(null, histories);
      }
    },
    (histories, done) => {
      var lastHomeworkSubmitId = histories[histories.length - 1];
      homeworkScoring.findById(lastHomeworkSubmitId, done);
    },
    (doc, done) => {
      if (doc) {
        result.userAnswerRepo = doc.userAnswerRepo;
        result.branch = doc.branch;
        result.result = doc.result;
      }
      apiRequest.get(result.uri, done);
    },
    (data, done) => {
      result.desc = getDesc(result.status, data.body.description);
      result.templateRepo = data.body.templateRepository;
      done(null, result);
    }
  ], (err, data) => {
    if (err) {
      return next(err);
    }
    var uri = data.uri;
    answerService.getAnswer({uri, id, userId}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.send({
        status: constant.httpCode.OK,
        quiz: result,
        answer: data
      });
    });
  });
};

HomeworkController.prototype.saveGithubUrl = (req, res, next) => {
  var userHomework;
  var index;
  async.waterfall([
    (done) => {
      var userId = req.session.user.id;
      userHomeworkQuizzes.findOne({userId: userId}).exec(done);
    },
    (data, done) => {
      userHomework = data;
      var orderId = parseInt(req.body.orderId) || 1;
      orderId = Math.max(1, orderId);
      orderId = Math.min(data.quizzes.length, orderId);
      index = orderId - 1;
      done(null, data.quizzes[index].uri);
    },
    (uri, done) => {
      apiRequest.get(uri, done);
    },
    (data, done) => {
      done(null, {
        branch: req.body.branch,
        userAnswerRepo: req.body.userAnswerRepo,
        evaluateScript: data.body.evaluateScript,
        version: req.body.commitSHA,
        callbackUrl: config.get('appServer') + 'homework/status'
      });
    },
    (data, done) => {
      request
        .post(config.get('taskServer') + 'tasks')
        .set('Content-Type', 'application/json')
        .send(data)
        .end(done);
    },
    (data, done) => {
      var id = data.body.id;
      userHomework.quizzes[index].status = data.body.status;
      userHomework.quizzes[index].homeworkSubmitPostHistory.push(id);
      userHomework.save((err) => {
        done(err, data.body);
      });
    }
  ], (err, data) => {
    if (err) {
      return next(req, res, err);
    }
    res.send(data);
  });
};

HomeworkController.prototype.createScoring = (req, res, next) => {
  var options = Object.assign({}, req.session, req.body);
  scoringService.createScoring(options, (err, data) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(data);
  });
};

HomeworkController.prototype.updateScoring = (req, res, next) => {
  const files = req.files;
  let updateFun;
  let options;
  if (req.body.buildNumber) {
    options = {historyId: req.params.historyId, buildNumber: req.body.buildNumber};
    updateFun = scoringService.updateScoringBuildNumber;
  } else {
    options = Object.assign({historyId: req.params.historyId}, req.body, files);
    updateFun = scoringService.updateScoring;
  }

  updateFun(options, (err, data) => {
    if (err) {
      return next(err);
    }
    res.send(data);
  });
};

HomeworkController.prototype.getQuiz = (req, res, next) => {
  quizService.getQuiz({
    paperId: parseInt(req.query.paperId),
    quizId: parseInt(req.params.quizId),
    userId: req.session.user.id
  }, (err, data) => {
    if (data) {
      res.send(data);
    } else {
      return next(err);
    }
  });
};

HomeworkController.prototype.getEstimatedTime = (req, res, next) => {
  var quizId = req.query.quizId;
  async.waterfall([
    (done) => {
      userHomeworkQuizzes.aggregate([
        {'$unwind': '$quizzes'}
      ])
        .match({'quizzes.id': Number(quizId)})
        .exec(done);
    },
    (doc, done) => {
      var recordIds = [];
      doc.forEach((item, i) => {
        recordIds = recordIds.concat(item.quizzes.homeworkSubmitPostHistory);
      });
      if (!recordIds.length) {
        return res.send({
          estimatedTime: null
        });
      }
      request
        .get(config.get('taskServer') + 'tasks')
        .set('Content-Type', 'application/json')
        .query({
          filter: JSON.stringify({
            id: recordIds
          })
        })
        .end(done);
    },
    (result, done) => {
      if (!result.body.length) {
        return res.send({
          estimatedTime: null
        });
      }
      var sumTime = result.body.map((item, i) => {
        var createdAt = Date.parse(new Date(item.createdAt)) / constant.time.MILLISECOND_PER_SECONDS;
        var updateAt = Date.parse(new Date(item.updatedAt)) / constant.time.MILLISECOND_PER_SECONDS;
        return updateAt - createdAt;
      }).reduce((item1, item2) => {
        return item1 + item2;
      });
      done(null, parseInt(sumTime / result.body.length));
    }
  ], (err, estimatedTime) => {
    if (err) {
      return next(err);
    }
    res.send({
      estimatedTime: estimatedTime
    });
  });
};

module.exports = HomeworkController;
