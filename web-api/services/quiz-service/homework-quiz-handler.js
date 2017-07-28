var async = require('async');
var superAgent = require('superagent');
var config = require('config');
var OperateHandler = require('./OperateHandler');
const constant = require('../../mixin/constant');
var Paper = require('../../models/paper');
var HomeworkScoring = require('../../models/homework-scoring');
var {QuizSubmit} = require('../../models/quiz-submit');
const deadline = 49;

class HomeworkQuizHandler extends OperateHandler {
  check(quizzes) {
    return quizzes.quizId;
  }

  subHandle(quizzes, callback) {
    let status;
    let desc;
    let submits = {};
    async.waterfall([
      (done) => {
        Paper.findOne({'sections.quizzes._id': quizzes._id})
          .populate(['sections.quizzes.quizId', 'sections.quizzes.submits'])
          .exec(done);
      },
      (doc, done) => {
        let previousQuiz;
        doc.toJSON().sections.forEach((section) => {
          let quiz = section.quizzes.find((quiz) => {
            return quiz._id + '' === quizzes._id + '';
          });
          if (quiz) {
            let currentIndex = section.quizzes.indexOf(quiz);
            previousQuiz = currentIndex !== 0 ? section.quizzes[currentIndex - 1] : {submits: [{status: 4}]};
            done(null, previousQuiz);
          }
        });
      },
      (previousQuiz, done) => {
        if (quizzes.submits.length && quizzes.quizId.__t !== 'BasicQuiz') {
          HomeworkScoring.findOne({_id: quizzes.submits[quizzes.submits.length - 1].homeworkScoringId})
            .exec((err, doc) => {
              submits = doc;
              status = submits.status;
              done(err, doc);
            });
        } else {
          if (previousQuiz.submits[previousQuiz.submits.length - 1]) {
            if (previousQuiz.submits[previousQuiz.submits.length - 1].homeworkScoringId) {
              HomeworkScoring.findOne({_id: previousQuiz.submits[previousQuiz.submits.length - 1].homeworkScoringId})
                .exec((err, doc) => {
                  if (err || !doc) {
                    done(err, null);
                  } else {
                    status = doc.status === constant.homeworkQuizzesStatus.SUCCESS
                      ? constant.homeworkQuizzesStatus.ACTIVE : constant.homeworkQuizzesStatus.LOCKED;
                  }
                  done(err, doc);
                });
            } else {
              status = constant.homeworkQuizzesStatus.ACTIVE;
              done(null, status);
            }
          } else {
            status = constant.homeworkQuizzesStatus.LOCKED;
            done(null, status);
          }
        }
      },
      (data, done) => {
        desc = getDesc(status, quizzes.quizId.description);
        const getJenkinsLogs = config.get('task.getJenkinsLogs');
        if (status === constant.homeworkQuizzesStatus.PROGRESS) {
          superAgent.get(`${getJenkinsLogs}${submits.jobName}/${submits.buildNumber}/consoleText`)
            .end((err, res) => {
              if (err) {
                return done(null, quizzes);
              }
              submits.result = res.text;
              return done(null, quizzes);
            });
        } else {
          done(null, quizzes);
        }
      },
      (quizzes, done) => {
        const homeworkQuiz = {
          uri: quizzes.quizId.uri,
          id: quizzes.quizId.id,
          desc,
          templateRepo: quizzes.quizId.templateRepository,
          userAnswerRepo: submits.userAnswerRepo,
          branch: submits.branch,
          result: submits.result,
          status,
          info: quizzes.info
        };
        done(null, homeworkQuiz);
      }
    ], callback);
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
}

function getDesc(status, realDesc) {
  if (status === constant.homeworkQuizzesStatus.LOCKED) {
    return '## 当前题目未解锁,请先完成之前的题目.';
  } else {
    return realDesc;
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

module.exports = HomeworkQuizHandler;
