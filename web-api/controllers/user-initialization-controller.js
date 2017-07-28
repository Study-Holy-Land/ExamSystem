'use strict';

var apiRequest = require('../services/api-request');
var LogicPuzzle = require('../models/logic-puzzle');
var UserHomeworkQuizzes = require('../models/user-homework-quizzes');
var UserPaperForm = require('../models/user-paper-form');
var constant = require('../mixin/constant');
var async = require('async');

function UserInitializationController() {

}

UserInitializationController.prototype.initializeQuizzes = (req, res) => {
  var userId = req.session.user.id;
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  var quizItems, quizExamples, blankQuizId;
  var enrollment, sections;
  var result = [];
  var logicQuizArray = [];
  var homeworkQuizArray = [];
  async.waterfall([
    (done) => {
      UserPaperForm.findOne({
        userId, programId, paperId
      }, (err, resp) => {
        if (err) {
          done(err, resp);
        } else {
          done(!!resp, resp);
        }
      });
    }, (data, done) => {
      apiRequest.get(`programs/${programId}/papers/${paperId}`, done);
    }, (responds, done) => {
      enrollment = responds.body;
      sections = enrollment.sections;
      async.map(sections, (section, callback) => {
        var type = section.sectionType;
        if (type === 'blankQuizzes') {
          blankQuizId = section.quizzes[0].id;
          var itemsUri = section.quizzes[0].items_uri;
          apiRequest.get(itemsUri, (err, respond) => {
            if (err) {
              done(err);
            }
            quizItems = respond.body.quizItems;

            quizExamples = respond.body.exampleItems;
            new LogicPuzzle({
              userId: userId,
              quizItems: quizItems,
              quizExamples: quizExamples,
              blankQuizId: blankQuizId,
              paperId: paperId,
              programId: programId
            }).save((err, data) => {
              if (err) {
                done(err);
              }
              callback(null, {type: 'logicQuizzes', id: data._id});
            });
          });
        } else if (type === 'homeworkQuizzes') {
          var homeworkQuiz = section.quizzes;
          UserHomeworkQuizzes.initUserHomeworkQuizzes(userId, homeworkQuiz, programId, paperId, (err, data) => {
            if (err) {
              done(err);
            }
            callback(null, {type, id: data._id});
          });
        }
      }, (err, results) => {
        if (err) {
          done(err, results);
        }
        result = results;
        done();
      });
    }
  ], (err, data) => {
    if (err && err !== true) {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR, message: err.message});
    } else {
      if (!data) {
        new UserPaperForm({
          userId, programId, paperId
        }).save((err, data) => {
          if (!err && data) {
            return res.send({status: constant.httpCode.OK, sections: result});
          }
          res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
          return res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR, message: err.message});
        });
      }

      LogicPuzzle.find({userId, programId, paperId}).select('_id').exec((err, logicQuizzes) => {
        if (err) {
          res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
          res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR, message: err.message});
        }

        UserHomeworkQuizzes.find({userId, programId, paperId}).select('_id').exec((err, homeworkQuizzes) => {
          if (err) {
            res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
            res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR, message: err.message});
          }

          logicQuizArray = (logicQuizzes.length === 0) ? [] : logicQuizzes.map((logicQuiz) => {
            var item = logicQuiz.toJSON();
            item.type = 'logicQuizzes';
            item.id = logicQuiz._id;
            return item;
          });

          homeworkQuizArray = (homeworkQuizzes.length === 0) ? [] : homeworkQuizzes.map((homeworkQuiz) => {
            var item = homeworkQuiz.toJSON();
            item.type = 'homeworkQuizzes';
            item.id = homeworkQuiz._id;
            return item;
          });

          result = logicQuizArray.concat(homeworkQuizArray);
          return res.send({status: constant.httpCode.OK, sections: result});
        });
      });
    }
  });
};

module.exports = UserInitializationController;
