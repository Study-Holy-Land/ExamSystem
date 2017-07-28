/*eslint no-magic-numbers: 2*/
/*eslint no-magic-numbers: 1*/
/*eslint no-magic-numbers: 0*/
'use strict';

var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var superAgent = require('superagent');
var async = require('async');
var userHomeworkQuizzes = require('../models/user-homework-quizzes');
const config = require('config');

var hour = constant.time.HOURS_PER_DAY;
var mintues = constant.time.MINUTE_PER_HOUR;
var second = constant.time.SECONDS_PER_MINUTE;

var dayToSecond = second * mintues * hour;
var hourToSecond = second * mintues;
var mintuesToSecond = mintues;
const Program = require('../models/program');

function UserController() {

}

function buildLogicPuzzleFeedback(data) {
  var isCompleted = false;
  var time = 0;

  if (data.endTime !== 'undefined' && data.endTime !== 0) {
    time = calcLogicPuzzleElapsedTime(data);

    isCompleted = true;
  }

  return {
    isCompleted: isCompleted,
    time: time
  };
}

function getUsersCommitHistory(commitHistoryFilter, callback) {
  var filter = {
    'id': commitHistoryFilter
  };

  var url = config.get('taskServer') + 'tasks';

  superAgent.get(url)
    .set('Content-Type', 'application/json')
    .query({
      filter: JSON.stringify(filter)
    })
    .end(callback);
}

function getHomeworkDetailsByUserId(userId, callback) {
  var logicPuzzleURL = 'users/' + userId + '/logicPuzzle';

  var user = {};
  async.waterfall([
    (done) => {
      apiRequest.get(logicPuzzleURL, (err, userDetail) => {
        user.logicPuzzle = userDetail.body;
        done(err, null);
      });
    },
    (data, done) => {
      userHomeworkQuizzes.findOne({userId: userId}, (err, homework) => {
        user.homework = homework;
        done(err, homework);
      });
    },
    (homework, done) => {
      if (homework !== null) {
        var filter = [];
        homework.quizzes.forEach((quiz) => {
          if (quiz.homeworkSubmitPostHistory.length !== 0) {
            filter.push(quiz.homeworkSubmitPostHistory[quiz.homeworkSubmitPostHistory.length - 1]);
          }
        });

        getUsersCommitHistory(filter, (err, userCommitHistory) => {
          user.userCommitHistory = userCommitHistory.body;
          done(err, null);
        });
      } else {
        done(null, null);
      }
    }], (err, result) => {
    callback(err, user);
  });
}

function getCommitTime(homeworkSubmitHistory, commitHistory) {
  return commitHistory.find((item) => {
    return item.id === homeworkSubmitHistory.toString();
  });
}

function buildHomeworkFeedback(homeworkDetails, commitHistories) {
  var homeworks = [];

  homeworkDetails.quizzes.forEach((result) => {
    var commitHistory = {};
    commitHistory.commitedNumbers = result.homeworkSubmitPostHistory.length;
    commitHistory.isCompleted = result.status === constant.homeworkQuizzesStatus.SUCCESS;

    if (result.homeworkSubmitPostHistory.length !== 0) {
      var commitTime = getCommitTime(result.homeworkSubmitPostHistory[result.homeworkSubmitPostHistory.length - 1], commitHistories);
      var lastSubmitHistoryCommitTime = Date.parse(commitTime.updatedAt) / constant.time.MILLISECOND_PER_SECONDS;
      var time = lastSubmitHistoryCommitTime - result.startTime;

      commitHistory.time = calcHomeworkElapsedTime(time);
    } else {
      commitHistory.time = 0;
    }

    homeworks.push(commitHistory);
  });

  return homeworks;
}

function buildFeedbackInfo(userId, callback) {
  getHomeworkDetailsByUserId(userId, (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    if (!data || data.homework === null || !data.homework.quizzes) {
      callback(null, null);
      return;
    }

    var logicPuzzleSummary = buildLogicPuzzleFeedback(data.logicPuzzle);
    var homeworkSummary = buildHomeworkFeedback(data.homework, data.userCommitHistory);

    var usersInfo = Object.assign({userId: userId}, {logicPuzzle: logicPuzzleSummary}, {homework: homeworkSummary});
    usersInfo.httpCode = constant.httpCode.OK;
    callback(null, usersInfo);
  });
}

function calcLogicPuzzleElapsedTime(logicPuzzle) {
  var startTime = logicPuzzle.startTime;
  var endTime = logicPuzzle.endTime;
  var time = endTime - startTime;

  var elapsedHour = 0;
  var elapsedMintues = 0;

  elapsedHour = Math.floor(time / hourToSecond);
  time -= hourToSecond * elapsedHour;
  elapsedMintues = Math.floor(time / mintuesToSecond);
  time -= mintuesToSecond * elapsedMintues;

  return elapsedHour + '小时' + elapsedMintues + '分' + time + '秒';
}

function calcHomeworkElapsedTime(time) {
  var elapsedDay = 0;
  var elapsedHour = 0;
  var elapsedMintues = 0;

  elapsedDay = Math.floor(time / dayToSecond);
  time -= elapsedDay * dayToSecond;
  elapsedHour = Math.floor(time / hourToSecond);
  time -= hourToSecond * elapsedHour;
  elapsedMintues = Math.floor(time / mintuesToSecond);

  return elapsedDay + '天' + elapsedHour + '小时' + elapsedMintues + '分';
}

UserController.prototype.getFeedback = (req, res, next) => {
  var userId = req.session.user.id;

  buildFeedbackInfo(userId, (err, feedbackInfo) => {
    if (err) return next(err);
    res.send(feedbackInfo);
  });
};

UserController.prototype.getUserProgramIds = (req, res) => {
  var userId = req.session.user.id;
  let items;
  async.waterfall([
    (done) => {
      Program.find({}, done);
    },
    (data, done) => {
      items = data;
      apiRequest.get('users/' + userId + '/programs', (err, resp, next) => {
        if (err) {
          return next(err);
        }
        done(null, resp.body);
      });
    },
    (data, done) => {
      let result = [];
      data.map((doc) => {
        const item = items.find((item) => {
          if (item.programId === doc.programId) {
            return item;
          }
        });
        if (item) {
          result.push(item);
        }
      });
      done(null, result);
    }
  ], (err, result) => {
    const docs = result.map((item) => {
      return {
        _id: item._id,
        programId: item.programId,
        makerId: item.makerId,
        programName: item.name,
        uriEnable: item.uriEnable,
        programCode: item.programCode,
        codeEnable: item.codeEnable,
        orderEnable: item.orderEnable,
        programType: item.programType
      };
    });
    if (err) {
      res.sendStatus(400);
    }
    res.send(docs);
  });
};

module.exports = UserController;
