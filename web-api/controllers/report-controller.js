'use strict';

var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var async = require('async');
var moment = require('moment');
var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var homeworkScoring = require('../models/homework-scoring');
var UserChannel = require('../models/user-channel.js');
var path = require('path');

const config = require('config');
var ejs = require('ejs');
var fs = require('fs');
var BREAK_LINE_CODE = 10;

function ReportController() {
}

function setCommitHistoryfilter(userhomeworks) {
  var CommitHistoryfilter = [];

  userhomeworks.forEach((userhomework) => {
    var objectIds = [];
    userhomework.quizzes.forEach((quiz) => {
      if (quiz.homeworkSubmitPostHistory.length !== 0) {
        objectIds.push(quiz.homeworkSubmitPostHistory[quiz.homeworkSubmitPostHistory.length - 1]);
      }
    });

    CommitHistoryfilter = CommitHistoryfilter.concat(objectIds);
  });

  return CommitHistoryfilter;
}

function getUsersCommitHistory(commitHistoryFilter, callback) {
  var filter = {
    'id': commitHistoryFilter
  };
  homeworkScoring.find({
    _id: {$in: filter.id}
  }, callback);

  //  var url = config.taskServer + 'tasks';
  //
  //  superAgent.get(url)
  //    .set('Content-Type', 'application/json')
  //    .query({
  //      filter: JSON.stringify(filter)
  //    })
  //    .end(callback);
}

function getUserDataByPaperId(paperId, callback) {
  var logicPuzzleURL = 'papers/' + paperId + '/logicPuzzle';
  var usersDetailURL = 'papers/' + paperId + '/usersDetail';
  var userData = {};

  async.waterfall([
    (done) => {
      apiRequest.get(usersDetailURL, (err, usersDetail) => {
        userData.usersDetail = usersDetail.body;
        done(err, null);
      });
    },
    (data, done) => {
      apiRequest.get(logicPuzzleURL, (err, logicPuzzle) => {
        userData.logicPuzzle = logicPuzzle.body;
        done(err, null);
      });
    },
    (data, done) => {
      userHomeworkQuizzes.find({paperId: paperId}, (err, userhomeworks) => {
        userData.homeworks = userhomeworks;
        done(err, userhomeworks);
      });
    },
    (userhomeworks, done) => {
      var commitHistoryFilter = setCommitHistoryfilter(userhomeworks);
      getUsersCommitHistory(commitHistoryFilter, (err, usersCommitHistory) => {
        userData.commitHistory = usersCommitHistory;
        done(err, null);
      });
    },
    (data, done) => {
      UserChannel.find()
        .populate('channelId')
        .exec((err, usersChannels) => {
          userData.channels = usersChannels;
          done(err, null);
        });
    }], (err, result) => {
    callback(err, userData);
  });
}

function buildUserSummary(data) {
  return {
    name: data.name,
    mobilePhone: data.mobilePhone,
    email: data.email,
    school: data.school,
    schoolProvince: data.schoolProvince,
    schoolCity: data.schoolCity,
    entranceYear: data.entranceYear
  };
}

function buildHomework(homeworks, usersCommitHistory, userId) {
  var sumTime = 0;
  var correctNumber = 0;
  var startTime = 0;
  var homework = {};

  var data = homeworks.find((homework) => {
    return homework.userId === userId;
  });

  if (!data || !data.quizzes) {
    return {};
  }

  data.quizzes.forEach((quiz, index) => {
    var elapsedTime = 0;

    if (quiz.homeworkSubmitPostHistory.length !== 0) {
      var lasthSubmitHistoryId = quiz.homeworkSubmitPostHistory[quiz.homeworkSubmitPostHistory.length - 1];

      var lastSubmitHistory = usersCommitHistory.find((log) => {
        return log.id === lasthSubmitHistoryId.toString();
      });

      if (lastSubmitHistory) {
        elapsedTime = lastSubmitHistory.commitTime - quiz.startTime;
      }
    }
    if ((quiz.homeworkSubmitPostHistory.length !== 0) && quiz.status === constant.homeworkQuizzesStatus.SUCCESS) {
      correctNumber++;
    }
    if (index === 0) {
      startTime = quiz.startTime;
    }
    sumTime += elapsedTime;
  });

  homework.homeworkCorrectNumber = correctNumber;
  homework.homeworkItemNumber = data.quizzes.length;
  homework.homeWorkStartTime = startTime;
  homework.elapsedTime = sumTime;

  return homework;
}

function buildChannel(usersChannels, userId) {
  var userChannel = usersChannels.find((channel) => {
    return channel.userId === userId;
  });

  return {
    channel: (!userChannel || !userChannel.channelId) ? '' : userChannel.channelId.name
  };
}

function buildScoresheetInfo(paperId, callback) {
  getUserDataByPaperId(paperId, (err, usersData) => {
    if (err) {
      callback(err);
      return;
    }
    var result = usersData.usersDetail.map((detail) => {
      var userSummary = detail;
      var logicPuzzleSummary = usersData.logicPuzzle.find((item) => {
        return item.userId === detail.userId;
      });

      var homeworkSummary = buildHomework(usersData.homeworks, usersData.commitHistory, detail.userId);
      homeworkSummary.paperId = paperId;

      var userChannelNameSummary = buildChannel(usersData.channels, detail.userId);

      return Object.assign({}, userSummary, logicPuzzleSummary, homeworkSummary, userChannelNameSummary);
    });

    callback(null, result);
  });
}

ReportController.prototype.exportPaperScoresheetCsv = (req, res, next) => {
  var paperId = req.params.paperId;

  buildScoresheetInfo(paperId, (err, scoresheetInfo) => {
    if (err) {
      return next(err);
    } else {
      fs.readFile(path.join(__dirname, '/../views/paper-scoresheet-csv.ejs'), (err, data) => {
        if (err) {
          return next(err);
        }

        var time = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY-MM-DD');

        var fileName = time + '/paper-' + paperId + '.csv';

        res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '');
        res.setHeader('Content-Type', 'text/csv');

        var csv = ejs.render(data.toString(), {
          scoresheetInfo: scoresheetInfo,
          moment: moment,
          constant: constant,
          config: config
        });

        csv = csv.split(String.fromCharCode(BREAK_LINE_CODE)).join('');
        csv = csv.split('#!!--').join(String.fromCharCode(BREAK_LINE_CODE));
        res.send(csv);
      });
    }
  });
};

function getHomeworkDetailsByUserId(userId, callback) {
  var userDetailURL = 'users/' + userId + '/detail';

  var user = {};
  async.waterfall([
    (done) => {
      apiRequest.get(userDetailURL, (err, userDetail) => {
        user.userDetail = userDetail.body;
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
          user.userCommitHistory = userCommitHistory;
          done(err, null);
        });
      } else {
        done(null, null);
      }
    }], (err, result) => {
    callback(err, user);
  });
}

function buildHomeworkDetail(quiz, userCommitHistory) {
  var homeworkDetails = {};
  var elapsedTime = 0;

  if (quiz.homeworkSubmitPostHistory.length !== 0) {
    var lasthSubmitHistoryId = quiz.homeworkSubmitPostHistory[quiz.homeworkSubmitPostHistory.length - 1];

    var lastSubmitHistory = userCommitHistory.find((log) => {
      return log.id === lasthSubmitHistoryId.toString();
    });

    if (lastSubmitHistory) {
      elapsedTime = lastSubmitHistory.commitTime - quiz.startTime;
      homeworkDetails.lastCommitedDetail = lastSubmitHistory.result;
    }
  } else {
    homeworkDetails.lastCommitedDetail = '--';
  }

  homeworkDetails.id = quiz.id;
  homeworkDetails.address = quiz.uri;
  homeworkDetails.startTime = quiz.startTime;
  homeworkDetails.commitNumbers = quiz.homeworkSubmitPostHistory.length;
  homeworkDetails.elapsedTime = elapsedTime;
  homeworkDetails.isPassed = quiz.status;
  return homeworkDetails;
}

function buildUserHomeworkDetails(paperId, userId, callback) {
  getHomeworkDetailsByUserId(userId, (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    if (!data || data.homework === null || !data.homework.quizzes) {
      callback(null, null);
      return;
    }
    var usersInfo = data.homework.quizzes.map((quiz, index) => {
      var userDetail;

      if (index === 0) {
        userDetail = data.userDetail;
      } else {
        userDetail = {
          name: '',
          mobilePhone: '',
          email: '',
          school: '',
          schoolProvince: '',
          schoolCity: '',
          entranceYear: '',
          major: ''
        };
      }

      var homeworkSummary = buildHomeworkDetail(quiz, data.userCommitHistory);
      homeworkSummary.paperId = paperId;

      return Object.assign({}, userDetail, {userId: userId}, homeworkSummary);
    });

    callback(null, usersInfo);
  });
}

ReportController.prototype.exportUserHomeworkDetailsCsv = (req, res, next) => {
  var paperId = req.params.paperId;
  var userId = req.params.userId;

  buildUserHomeworkDetails(paperId, userId, (err, userHomeworkDetails) => {
    if (err) {
      return next(err);
    }

    fs.readFile(path.join(__dirname, '/../views/userhomeworkdetailscsv.ejs'), (err, data) => {
      if (err) {
        next(err);
      }

      var time = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY-MM-DD');
      var fileName = time + '-paper-' + paperId + '-user-' + userId + '.csv';

      res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '');
      res.setHeader('Content-Type', 'text/csv');

      var csv = ejs.render(data.toString(), {
        userHomeworkDetails: userHomeworkDetails,
        moment: moment,
        constant: constant,
        config: config
      });

      csv = unescapeHTML(csv);
      csv = csv.split(String.fromCharCode(BREAK_LINE_CODE)).join('');
      csv = csv.split('#!!--').join(String.fromCharCode(BREAK_LINE_CODE));
      res.send(csv);
    });
  });
};

function unescapeHTML(str) {
  str += '';
  var unescapeEntity = {};
  var runescapeEntity = /&([^;]+);/g;
  var rentityCodeHex = /^#x([\da-fA-F]+)$/;
  var rentityCode = /^#(\d+)$/;
  str = str.replace(runescapeEntity, (entity, entityCode) => {
    if (unescapeEntity.hasOwnProperty(entity)) {
      return unescapeEntity[entity];
    }

    if (entityCode.match(rentityCodeHex)) {
      return String.fromCharCode(parseInt(entityCode.match(rentityCodeHex)[1], 16));
    }

    if (entityCode.match(rentityCode)) {
      return String.fromCharCode(entityCode.match(rentityCode)[1]);
    }

    return entity;
  });
  return str;
}

function getHomeworkCommitHIstoryByUserId(userId, callback) {
  var userDetailURL = 'users/' + userId + '/detail';

  var user = {};
  async.waterfall([
    (done) => {
      apiRequest.get(userDetailURL, (err, userDetail) => {
        user.userDetail = userDetail.body;
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
      var filter = [];
      homework.quizzes.forEach((quiz) => {
        if (quiz.homeworkSubmitPostHistory.length !== 0) {
          filter = filter.concat(quiz.homeworkSubmitPostHistory);
        }
      });

      getUsersCommitHistory(filter, (err, userCommitHistory) => {
        user.userCommitHistory = userCommitHistory;
        done(err, null);
      });
    }], (err, result) => {
    callback(err, user);
  });
}

function buildUserHomeworkQuizDetails(paperId, userId, homeworkquizId, callback) {
  getHomeworkCommitHIstoryByUserId(userId, (err, data) => {
    var usersInfo = [];
    if (err) {
      callback(err);
      return;
    }

    var homeworkquiz = data.homework.quizzes.find((quiz) => {
      return quiz.id.toString() === homeworkquizId;
    });

    if (homeworkquiz !== undefined && homeworkquiz.homeworkSubmitPostHistory.length !== 0) {
      homeworkquiz.homeworkSubmitPostHistory.forEach((commitItem, index) => {
        var userInfo = {};
        var userSummary;
        var homeworkSummary = {};

        if (index === 0) {
          userSummary = buildUserSummary(data.userDetail);
          userInfo.startTime = homeworkquiz.startTime;
          userInfo.homeworkQuizUri = homeworkquiz.uri;
        } else {
          userSummary = buildUserSummary({
            name: '',
            mobilePhone: '',
            email: ''
          });
          userInfo.startTime = '';
          userInfo.homeworkQuizUri = '';
        }
        userInfo.userId = userId;

        var commithistory = data.userCommitHistory.find((log) => {
          return commitItem.toString() === log.id;
        });

        homeworkSummary.userAnswerRepo = commithistory.userAnswerRepo;
        homeworkSummary.result = commithistory.result;
        homeworkSummary.elapsedTime = calculateElapsedTime(index, homeworkquiz, data.userCommitHistory);

        usersInfo.push(Object.assign({}, userSummary, userInfo, homeworkSummary));
      });
    }

    callback(null, usersInfo);
  });
}

function getupdatedAtTimeById(id, userCommitHistory) {
  var time = userCommitHistory.find((commitHistory) => {
    return id.toString() === commitHistory.id;
  });

  return time.commitTime;
}

function calculateElapsedTime(index, homeworkquiz, userCommitHistory) {
  var time;
  if (index === 0) {
    time = getupdatedAtTimeById(homeworkquiz.homeworkSubmitPostHistory[index], userCommitHistory) - homeworkquiz.startTime;
  } else {
    time = getupdatedAtTimeById(homeworkquiz.homeworkSubmitPostHistory[index], userCommitHistory) - getupdatedAtTimeById(homeworkquiz.homeworkSubmitPostHistory[index - 1], userCommitHistory);
  }

  return time;
}

ReportController.prototype.exportUserHomeworkQuizDetailsCsv = (req, res, next) => {
  var paperId = req.params.paperId;
  var userId = req.params.userId;
  var homeworkquizId = req.params.homeworkquizId;
  buildUserHomeworkQuizDetails(paperId, userId, homeworkquizId, (err, userHomeworkQuizDetails) => {
    if (err) {
      return next(err);
    }

    fs.readFile(path.join(__dirname, '/../views/userhomeworkquizdetailscsv.ejs'), (err, data) => {
      if (err) {
        return next(err);
      }
      var time = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY-MM-DD');
      var fileName = time + '-paper-' + paperId + '-user-' + userId + '-homeworkquiz-' + homeworkquizId + '.csv';

      res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '');
      res.setHeader('Content-Type', 'text/csv');

      var csv = ejs.render(data.toString(), {
        userHomeworkQuizDetails: userHomeworkQuizDetails,
        moment: moment,
        constant: constant,
        config: config
      });

      csv = unescapeHTML(csv);
      csv = csv.split(String.fromCharCode(BREAK_LINE_CODE)).join('');
      csv = csv.split('#!!--').join(String.fromCharCode(BREAK_LINE_CODE));

      res.send(csv);
    });
  });
};

module.exports = ReportController;
