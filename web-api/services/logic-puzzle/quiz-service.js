'use strict';
const async = require('async');
const Paper = require('../../models/paper');
const {LogicPuzzleSubmit} = require('../../models/quiz-submit');

function getList(params, callback) {
  callback(null, null);
}

function saveAnswer(options, callback) {
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

module.exports = {
  getList: getList,
  saveAnswer: saveAnswer
};
