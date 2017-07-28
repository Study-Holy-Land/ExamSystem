const async = require('async');
const Paper = require('../../models/paper');
const Program = require('../../models/program');
const apiRequest = require('../api-request');
const LogicPuzzleHandler = require('./logic-puzzle-handler');
const HomeworkQuizHandler = require('./homework-quiz-handler');
const BasicQuizHandler = require('./basic-quiz-handler');
const {LogicPuzzleSubmit, BasicQuizSubmit} = require('../../models/quiz-submit');
const constant = require('../../mixin/constant');

const handleSection = {
  'LogicPuzzle': new LogicPuzzleHandler(),
  'HomeworkQuiz': new HomeworkQuizHandler(),
  'BasicQuiz': new BasicQuizHandler()
};

class QuizService {
  constructor() {
    this.logicPuzzleHandler = new LogicPuzzleHandler();
    this.homeworkQuizHandler = new HomeworkQuizHandler();
  }

  operate(id, callback) {
    async.waterfall([
      (done) => {
        Paper.aggregate()
            .unwind('$sections')
            .unwind('$sections.quizzes')
            .match({'sections.quizzes._id': id})
            .exec(done);
      },
      (doc, done) => {
        Paper.populate(doc, ['sections.quizzes.quizId', 'sections.quizzes.submits'], done);
      },
      (docs, done) => {
        done(null, docs[0]);
      }, (quiz, done) => {
        const info = {};
        info.programId = quiz.programId;
        info.paperId = quiz._id;
        info.type = quiz.sections.quizzes.quizId.__t;
        quiz.sections.quizzes.info = info;

        done(null, quiz.sections.quizzes);
      },
      (data, done) => {
        this.logicPuzzleHandler.handle(data, done);
      },
      (data, done) => {
        this.homeworkQuizHandler.handle(data, done);
      }
    ], callback);
  }

  getPaperInfo(condition, callback) {
    let paper;
    async.waterfall([
      (done) => {
        Paper.findOne({userId: condition.userId, 'sections.quizzes._id': condition.quizId}, (err, doc) => {
          if (err || !doc) {
            return done({status: 404}, null);
          }
          done(null, doc);
        });
      },
      (data, done) => {
        paper = data.toJSON();
        Program.findOne({programId: paper.programId}, done);
      },
      (program, done) => {
        paper.program = {};
        paper.program.type = program.toJSON().programType;
        Paper.findOne({userId: condition.userId, 'sections.quizzes._id': condition.quizId})
            .populate('sections.quizzes.quizId')
            .exec(done);
      },
      (doc, done) => {
        let sections = doc.toJSON().sections;
        async.map(sections, (section, callback) => {
          handleSection[section.quizzes[0].quizId.__t].getStatus(section, callback);
        }, done);
      },
      (result, done) => {
        paper.sections.map((section, index) => {
          section.type = result[index].type;
          section.status = result[index].status;
        });
        let paperInfo = {
          program: {
            type: paper.program.type
          },
          sections: paper.sections
        };
        done(null, paperInfo);
      }
    ], (err, result) => {
      callback(err, result);
    });
  }

  getSection(condition, cb) {
    async.waterfall([
      (done) => {
        Paper
            .findOne({'sections.quizzes._id': condition.quizId, userId: condition.userId})
            .populate('sections.quizzes.quizId')
            .exec(done);
      },
      (docs, done) => {
        let sections = docs.toJSON().sections;
        async.map(sections, (section, callback) => {
          handleSection[section.quizzes[0].quizId.__t].getStatus(section, callback);
        }, done);
      }
    ], (err, result) => {
      cb(err, result);
    });
  }

  getOneSection(condition, cb) {
    async.waterfall([
      (done) => {
        Paper
            .findOne({'sections.quizzes._id': condition.quizId, userId: condition.userId})
            .populate('sections.quizzes.quizId')
            .exec(done);
      },
      (docs, done) => {
        let sections = docs.toJSON().sections;
        let section = sections.filter(({_id}) => {
          return _id.toString() === condition.sectionId;
        });
        handleSection[section[0].quizzes[0].quizId.__t].getStatus(section[0], done);
      }
    ], (err, result) => {
      cb(err, result);
    });
  }

  saveAnswer(options, callback) {
    const {userAnswer, quizId} = options;
    let logicPuzzleDocId = '';
    async.waterfall([
      (done) => {
        let logicPuzzleSubmitDocument = new LogicPuzzleSubmit({userAnswer});
        logicPuzzleSubmitDocument.save((err, doc) => {
          logicPuzzleDocId = doc._id;
          done(err, doc);
        });
      },
      (doc, done) => {
        Paper.findOne({'sections.quizzes._id': quizId.toString()}, (err, doc) => {
          done(err, doc);
        });
      },
      (doc, done) => {
        doc.sections.forEach(section => {
          let dot = section.quizzes.find(quiz => quiz._id.toString() === quizId.toString());
          if (dot) {
            dot.submits.push(logicPuzzleDocId);
          }
        });
        done(null, doc);
      },
      (doc, done) => {
        Paper.findByIdAndUpdate(doc._id, doc).exec((err, doc) => {
          done(err, doc);
        });
      }
    ], (err, doc) => {
      callback(err, doc);
    });
  }

  getQuizzesOfSection(condition, callback) {
    let startTime;
    async.waterfall([
      (done) => {
        Paper
            .findOne({'sections.quizzes._id': condition.quizId, userId: condition.userId})
            .populate(['sections.quizzes.submits', 'sections.quizzes.quizId'])
            .exec((err, doc) => {
              if (err) {
                throw err;
              }
              startTime = parseInt(new Date().getTime() / constant.time.MILLISECOND_PER_SECONDS);
              const currentSection = doc.sections.find(section => {
                let isCurrentQuiz = section.quizzes.some((quiz) => String(quiz._id) === condition.quizId);
                if (isCurrentQuiz) {
                  return isCurrentQuiz;
                }
              });

              if (currentSection.startTime) {
                startTime = currentSection.startTime;
                done(null, currentSection);
              } else {
                var sectionIndex = doc.sections.indexOf(currentSection);
                doc.sections[sectionIndex].startTime = startTime;
                doc.save((err, doc) => {
                  if (err) {
                    done(err, null);
                  }
                  done(null, currentSection);
                });
              }
            });
      }
    ], (err, result) => {
      callback(err, result);
    });
  }

  submitLogicPuzzleSection({id, sectionId}, callback) {
    let startTime;
    let endTime = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    async.waterfall([
      (done) => {
        Paper.findOne({'sections._id': sectionId}, (err, doc) => {
          done(err, doc);
        });
      },
      (doc, done) => {
        let thisSection = doc.sections.find(section => section._id + '' === sectionId);
        let sectionIndex = doc.sections.indexOf(thisSection);
        doc.sections[sectionIndex].endTime = endTime;
        startTime = doc.sections[sectionIndex].startTime;
        doc.save((err, doc) => {
          done(err, doc);
        });
      },
      (data, done) => {
        Paper.aggregate()
            .unwind('$sections')
            .match({'sections._id': id})
            .exec((err, doc) => {
              done(err, doc);
            });
      },
      (doc, done) => {
        Paper.populate(doc, ['sections.quizzes.quizId', 'sections.quizzes.submits'], done);
      },
      (data, done) => {
        let scoreSheetData = {
          data: data,
          startTime: startTime,
          endTime: endTime
        };
        let scoreSheetUri = 'scoresheets';
        let itemPosts = [];
        let doc = scoreSheetData.data;
        let paperId = doc[0].paperId;
        doc[0].sections.quizzes.forEach((quiz) => {
          itemPosts.push({answer: quiz.submits[quiz.submits.length - 1].userAnswer + '', quizItemId: quiz.quizId.id});
        });

        let body = {
          examerId: doc[0].userId,
          paperId: paperId,
          blankQuizSubmits: [{
            startTime: scoreSheetData.startTime,
            endTime: scoreSheetData.endTime,
            blankQuizId: 1,
            itemPosts: itemPosts
          }]
        };
        apiRequest.post(scoreSheetUri, body, done);
      }
    ], (err, doc) => {
      callback(err, doc);
    });
  }

  submitBasicQuizSection({id, quizzes}, callback) {
    let endTime;
    let thisSection;
    let startTime;
    let paperId;
    let userId;
    let sectionId;
    let submitAnswer;
    async.waterfall([
      (done) => {
        Paper.findOne({'sections._id': id})
            .populate('sections.quizzes.quizId')
            .exec(done);
      },
      (docs, done) => {
        paperId = docs.paperId;
        userId = docs.userId;
        let sections = docs.sections;
        const section = sections.find((section) => section._id + '' === id);
        done(null, section);
      },
      (section, done) => {
        startTime = section.startTime;
        sectionId = section.sectionId;
        let userAnswer = quizzes.map(({quizId, userAnswer}) => {
          return ({id: quizId.id, type: quizId.type, answer: userAnswer});
        });
        submitAnswer = quizzes.map(({quizId, userAnswer}) => {
          return ({id: quizId._id, answer: userAnswer});
        });
        done(null, userAnswer);
      },
      (userAnswer, done) => {
        endTime = parseInt(new Date().getTime() / constant.time.MILLISECOND_PER_SECONDS);
        let body = {
          paperId,
          examerId: userId,
          sectionId,
          basicQuizSubmits: [{
            startTime,
            endTime,
            basicQuizPosts: userAnswer
          }]
        };
        apiRequest.post('scoresheets', body, done);
      },
      (data, done) => {
        Paper.findOne({'sections._id': id}).exec((err, doc) => {
          if (err) {
            return done(err, null);
          }
          thisSection = doc.sections.find(section => section._id + '' === id);
          if (thisSection.endTime) {
            endTime = thisSection.endTime;
            done(null, doc);
          } else {
            let sectionIndex = doc.sections.indexOf(thisSection);
            doc.sections[sectionIndex].endTime = endTime;
            startTime = doc.sections[sectionIndex].startTime;
            async.each(doc.sections[sectionIndex].quizzes, (quiz, callback) => {
              let userAnswer = submitAnswer.find(item => item.id + '' === quiz.quizId + '').answer;
              let basicQuizSubmitDocument = new BasicQuizSubmit({userAnswer});
              basicQuizSubmitDocument.save((err, doc) => {
                quiz.submits.push(doc._id);
                callback(err);
              });
            }, (err) => {
              done(err, doc);
            });
          }
        });
      },
      (doc, done) => {
        doc.save((err, doc) => {
          if (err) {
            done(err, null);
          }
          done(null, doc);
        });
      }
    ], (err, result) => {
      callback(err, result);
    });
  }
}

module.exports = QuizService;
