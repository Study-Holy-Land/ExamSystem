'use strict';

var async = require('async');
var request = require('superagent');
var mongoose = require('mongoose');
var homeworkScoring = require('../../models/homework-scoring');
var path = require('path');
const config = require('config');
var scriptBasePath = path.join(__dirname, '/../..');
var apiRequest = require('../api-request');
var fs = require('fs');
var taskApi = config.get('task.taskApi');
var callbackTaskUrl = config.get('task.callbackTaskUrl');
var {HomeworkQuizSubmit} = require('../../models/quiz-submit');
var Paper = require('../../models/paper');
var {QuizSubmit} = require('../../models/quiz-submit');
var constant = require('../../mixin/constant');

function createScoring(options, callback) {
  var homeworkQuizDefinition;
  var result;
  var homeworkSubmitId = '';
  var stackDefinition = '';
  var startTime;
  var answerPath;
  async.waterfall([
    (done) => {
      Paper.findOne({'sections.quizzes._id': options.quizId})
        .populate(['sections.quizzes.quizId', 'sections.quizzes.submits'])
        .exec(done);
    },
    (doc, done) => {
      let previousQuiz;
      doc.toJSON().sections.forEach((section) => {
        let quiz = section.quizzes.find((quiz) => {
          return quiz._id + '' === options.quizId + '';
        });

        if (quiz) {
          let currentQuizIndex = section.quizzes.indexOf(quiz);
          if (currentQuizIndex === 0) {
            startTime = section.startTime;
            done(null, startTime);
          } else {
            previousQuiz = section.quizzes[currentQuizIndex - 1];
            homeworkScoring.findById(previousQuiz.submits[previousQuiz.submits.length - 1].homeworkScoringId, done);
          }
        }
      });
    },
    (data, done) => {
      if (data !== startTime) {
        startTime = data.toJSON().commitTime;
      }
      done(null, startTime);
    },
    (doc, done) => {
      apiRequest.get(options.homeworkQuizUri, function(err, resp) {
        done(err, resp.body);
      });
    },
    (homeworkQuiz, done) => {
      apiRequest.get(`stacks/${homeworkQuiz.stackId}`, (err, resp) => {
        stackDefinition = resp.body.definition;
        done(err, homeworkQuiz);
      });
    },
    (homeworkQuiz, done) => {
      homeworkQuizDefinition = homeworkQuiz.evaluateScript;
      answerPath = homeworkQuiz.answerPath;
      if (homeworkQuizDefinition[0] === '.') {
        homeworkQuizDefinition = homeworkQuizDefinition.substr(1, homeworkQuizDefinition.length);
      }
      options.startTime = startTime;
      options.commitTime = parseInt(new Date().getTime() / 1000);
      homeworkScoring.create(options, done);
    },
    (data, done) => {
      result = data;
      let homeworkQuizSubmit = new HomeworkQuizSubmit({homeworkScoringId: result._id});
      homeworkQuizSubmit.save((err, doc) => {
        done(err, doc);
      });
    },
    (doc, done) => {
      homeworkSubmitId = doc._id;
      Paper.findOne({'sections.quizzes._id': options.quizId}, done);
    },
    (doc, done) => {
      doc.sections.forEach(section => {
        let dot = section.quizzes.find(quiz => quiz._id.toString() === options.quizId.toString());
        if (dot) {
          dot.submits.push(homeworkSubmitId);
        }
      });
      Paper.findByIdAndUpdate(doc._id, doc, done);
    },
    (doc, done) => {
      var scriptPath = scriptBasePath + homeworkQuizDefinition;
      fs.exists(scriptPath, function(fileOk) {
        if (fileOk) {
          fs.readFile(scriptPath, 'utf-8', function(error, data) {
            if (error) {
              done(error, null);
            } else {
              done(null, data);
            }
          });
        } else {
          done(true, 'file not found');
        }
      });
    },
    (script, done) => {
      script = script.toString().split('\n').join('\\n');
      request
        .post(taskApi)
        .auth('twars', 'twars')
        .query({script})
        .query({user_answer_repo: options.userAnswerRepo})
        .query({branch: options.branch})
        .query({callback_url: callbackTaskUrl + '' + result._id})
        .query({image: stackDefinition})
        .attach('answer.zip', path.resolve(__dirname, '../../', answerPath))
        .end((err, data) => {
          done(err, data);
        });
    }
  ], (err) => {
    callback(err, result);
  });
}

function updateScoringBuildNumber(options, callback) {
  const {historyId, buildNumber} = options;
  homeworkScoring.findByIdAndUpdate(historyId, {buildNumber}, callback);
}

function updateScoring(options, callback) {
  const resultFileName = options.result ? options.result[0].filename : '';
  const resultPath = path.resolve(__dirname, `../../homework-script/${resultFileName}`);
  async.waterfall([
    (done) => {
      fs.stat(resultPath, (err, stat) => {
        done(err, stat);
      });
    },
    (stat, done) => {
      fs.readFile(resultPath, {encoding: 'utf8'}, (err, data) => {
        if (!err && data) {
          options.result = data;
        }
        done(err);
      });
    },
    (done) => {
      homeworkScoring.findByIdAndUpdate({
        _id: options.historyId
      }, options, done);
    },
    (data, done) => {
      homeworkScoring.findById(options.historyId, done);
    },
    (doc, done) => {
      QuizSubmit.findOne({homeworkScoringId: options.historyId})
        .exec(done);
    },
    (doc, done) => {
      let id = mongoose.Types.ObjectId(doc._id);
      Paper.aggregate()
        .unwind('$sections')
        .unwind('$sections.quizzes')
        .match({'sections.quizzes.submits': id})
        .exec(done);
    },
    (paper, done) => {
      Paper.populate(paper, ['sections.quizzes.quizId', 'sections.quizzes.submits'], done);
    },
    (data, done) => {
      let submits = data[0].sections.quizzes.submits;
      let quizId = data[0].sections.quizzes.quizId.id;
      async.map(submits, ({homeworkScoringId}, callback) => {
        homeworkScoring.findById(homeworkScoringId, callback);
      }, (err, result) => {
        let paper = {userId: data[0].userId, paperId: data[0].paperId, homeworkPostHistory: result};
        done(err, paper, quizId);
      });
    },
    (doc, quizId, done) => {
      var homeworkData = {
        'examerId': doc.userId,
        'paperId': doc.paperId,
        'homeworkSubmits': [{
          'homeworkQuizId': quizId,
          'homeworkSubmitPostHistory': doc.homeworkPostHistory
        }]
      };
      done(null, homeworkData);
    },
    (data, done) => {
      if (parseInt(options.status) !== constant.homeworkQuizzesStatus.SUCCESS) {
        return done(null, null);
      } else {
        apiRequest.post('scoresheets', data, (err, resp) => {
          done(err, resp);
        });
      }
    }
  ], callback);
}

module.exports = {
  createScoring: createScoring,
  updateScoring: updateScoring,
  updateScoringBuildNumber: updateScoringBuildNumber
};
