var apiRequest = require('../../services/api-request');
var async = require('async');
var Paper = require('../../models/paper');
var LogicPuzzleHandler = require('./paper-logic-puzzle-handler');
var HomeworkQuizHandler = require('./paper-homework-quiz-handler');
var BasicQuizHandler = require('./paper-basic-quiz-handler');
var constant = require('../../mixin/constant');

const handlerMap = {
  'blankQuizzes': new LogicPuzzleHandler(),
  'homeworkQuizzes': new HomeworkQuizHandler(),
  'basicQuizzes': new BasicQuizHandler()
};

const handleSection = {
  'LogicPuzzle': new LogicPuzzleHandler(),
  'HomeworkQuiz': new HomeworkQuizHandler(),
  'BasicQuiz': new BasicQuizHandler()
};

class PaperService {
  retrieve(condition, cb) {
    async.waterfall([
      (done) => {
        Paper.findOne(condition, done);
      },
      (doc, done) => {
        doc ? done(!!doc, doc) : done(null, doc);
      },
      (doc, done) => {
        let pathUri = `programs/${condition.programId}/papers/${condition.paperId}`;
        apiRequest.get(pathUri, done);
      },
      (resp, done) => {
        async.map(resp.body.sections, (section, callback) => {
          handlerMap[section.sectionType].bulkFindOrCreate(section, callback);
        }, done);
      },
      (result, done) => {
        condition.paperUri = `programs/${condition.programId}/papers/${condition.paperId}`;
        let paper = new Paper(condition);
        paper.sections = result.map((item) => {
          return {
            sectionName: item.sectionName,
            sectionId: item.sectionId,
            quizzes: item.quizIds};
        }
        );
        paper.save(done);
      }
    ], (err, doc) => {
      if (err === true) {
        return cb(null, {id: doc._id + ''});
      }
      if (!err && doc) {
        return cb(null, {id: doc._id + ''});
      }
      return cb(err, null);
    });
  }

  getSection(condition, cb) {
    async.waterfall([
      (done) => {
        Paper
          .findOne(condition)
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

  getQuestionIds(sectionId, cb) {
    async.waterfall([
      (done) => {
        Paper
          .findOne({'sections._id': sectionId})
          .populate(['sections.quizzes.quizId', 'sections.quizzes.submits'])
          .exec(done);
      },
      (docs, done) => {
        const section = docs.sections.find((section) => section._id + '' === sectionId);
        handleSection[section.quizzes[0].quizId.__t].getIds(section, done);
      }
    ], (err, result) => {
      cb(err, result);
    });
  }

  getQuizList(sectionId, cb) {
    let startTime;
    let thisSection;
    async.waterfall([
      (done) => {
        Paper.findOne({'sections._id': sectionId}).exec((err, doc) => {
          if (err) {
            return done(err, null);
          }
          startTime = parseInt(new Date().getTime() / constant.time.MILLISECOND_PER_SECONDS);
          thisSection = doc.sections.find(section => section._id + '' === sectionId);
          if (thisSection.startTime) {
            startTime = thisSection.startTime;
            done(null, doc);
          } else {
            var sectionIndex = doc.sections.indexOf(thisSection);
            doc.sections[sectionIndex].startTime = startTime;
            doc.save((err, doc) => {
              if (err) {
                done(err, null);
              }
              done(null, doc);
            });
          }
        });
      },
      (data, done) => {
        Paper.findOne({'sections._id': sectionId})
          .populate('sections.quizzes.quizId')
          .exec(done);
      },
      (docs, done) => {
        let sections = docs.sections;
        const section = sections.find((section) => section._id + '' === sectionId);
        let quizzes = {section, paperId: docs._id, programId: docs.programId};
        cb(null, quizzes);
      }
    ], (err, result) => {
      cb(err, result);
    });
  }

  submitPaper({condition, quizzes}, cb) {
    let endTime;
    let thisSection;
    let startTime;
    let paperId;
    let sectionId;
    async.waterfall([
      (done) => {
        Paper.findOne({'sections._id': condition.sectionId})
          .populate('sections.quizzes.quizId')
          .exec(done);
      },
      (docs, done) => {
        paperId = docs.paperId;
        let sections = docs.sections;
        const section = sections.find((section) => section._id + '' === condition.sectionId);
        done(null, section);
      },
      (section, done) => {
        startTime = section.startTime;
        sectionId = section.sectionId;
        let userAnswer = quizzes.map(({quizId, userAnswer}) => {
          return ({id: quizId.id, type: quizId.type, answer: userAnswer});
        });
        done(null, userAnswer);
      },
      (userAnswer, done) => {
        endTime = parseInt(new Date().getTime() / constant.time.MILLISECOND_PER_SECONDS);
        let body = {
          paperId,
          examerId: condition.userId,
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
        Paper.findOne({'sections._id': condition.sectionId}).exec((err, doc) => {
          if (err) {
            return done(err, null);
          }
          thisSection = doc.sections.find(section => section._id + '' === condition.sectionId);
          if (thisSection.endTime) {
            endTime = thisSection.endTime;
            done(null, doc);
          } else {
            var sectionIndex = doc.sections.indexOf(thisSection);
            doc.sections[sectionIndex].endTime = endTime;
            startTime = doc.sections[sectionIndex].startTime;
            doc.save((err, doc) => {
              if (err) {
                done(err, null);
              }
              done(null, doc);
            });
          }
        });
      }
    ], (err, result) => {
      cb(err, result);
    });
  };
}

module.exports = PaperService;
