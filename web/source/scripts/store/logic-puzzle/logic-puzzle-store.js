'use strict';

var Reflux = require('reflux');
var LogicPuzzleActions = require('../../actions/logic-puzzle/logic-puzzle-actions');
var superAgent = require('superagent');
var async = require('async');
var page = require('page');
var _currentIndex = 0;
var _answer;
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');
var getQueryString = require('../../../../tools/getQueryString');
// var programId = getQueryString('programId');
var paperId = getQueryString('paperId');
var sectionId = getQueryString('sectionId');
var questionId = getQueryString('questionId');
var questionIds;

var LogicPuzzleStore = Reflux.createStore({
  listenables: [LogicPuzzleActions],

  onInit: function () {
    let isSubmit = false;
    let programId = 1;
    let programType = 'exam';
    async.waterfall([
      (done) => {
        const uri = `${API_PREFIX}puzzle/${questionId}/status`;
        superAgent.get(uri)
          .set('Content-Type', 'application/json')
          .end((err, resp) => {
            if (resp.body) {
              isSubmit = resp.body.isSubmit;
              programId = resp.body.programId;
            }
            done(err);
          });
      },
      (done) => {
        superAgent.get(API_PREFIX + 'user/programs')
          .set('Content-Type', 'application/json')
          .use(errorHandler)
          .end(done);
      },
      (res, done) => {
        programType = res.body.find(program => parseInt(programId) === program.programId).programType;
        done(null);
      },
      (done) => {
        superAgent.get(API_PREFIX + 'test/detail')
          .set('Content-Type', 'application/json')
          .end(function (err, resp) {
            if (err) {
              return done(err, null);
            }
            if (resp.body.data === false) {
              done(true, null);
            } else {
              done(null, null);
            }
          });
      },
      (data, done) => {
        const uri = `${API_PREFIX}programs/${programId}/papers/${paperId}/sections/${sectionId}/questionIds`;
        superAgent.get(uri)
          .set('Content-Type', 'application/json')
          .end(function (err, resp) {
            if (err) {
              done(err, null);
            } else {
              questionIds = resp.body;
              done(null, null);
            }
          });
      }
    ], (err) => {
      if (err === true) {
        page('user-center.html#userDetail');
      }
      if (err === 'committed') {
        page('dashboard.html');
      }
      if (err) {
        return errorHandler.showError(err);
      }
      this.trigger({itemsCount: questionIds.length, disableSubmit: (programType === 'practice' && isSubmit)});
    });
  },

  onLoadItem: function () {
    async.waterfall([
      (callback) => {
        this.updateItem(questionId, callback);
      }, (res, callback) => {
        _answer = res.body.userAnswer;
        this.trigger({
          item: res.body.item,
          userAnswer: res.body.userAnswer,
          itemsCount: res.body.itemsCount,
          orderId: _currentIndex,
          isExample: res.body.isExample,
          programId: res.body.info.programId,
          paperId: res.body.info.paperId
        });
        callback(null, 'done');
      }
    ], function (err, result) {
      if (err) {
        return;
      }
    });
  },

  onSubmitAnswer: function (type, newOrderId) {
    _currentIndex = newOrderId;
    var quizId = questionIds[_currentIndex].id;

    async.waterfall([
      (callback) => {
        var index = type === 'previous' ? _currentIndex + 1 : _currentIndex - 1;
        if (_currentIndex === 0) {
          this.onSaveUserAnswer(questionIds[_currentIndex].id, callback);
        }
        this.onSaveUserAnswer(questionIds[index].id, callback);
      }, (res, callback) => {
        this.updateItem(quizId, callback);
      }, (res, callback) => {
        _answer = res.body.userAnswer;
        this.trigger({
          item: res.body.item,
          userAnswer: res.body.userAnswer,
          itemsCount: res.body.itemsCount,
          orderId: _currentIndex,
          isExample: res.body.isExample,
          lastLoad: false,
          nextLoad: false,
          submitLoad: false
        });
        callback(null, 'done');
      }
    ], function (err, result) {
      if (err) {
        return;
      }
    });
  },

  onSaveUserAnswer: function (quizId, callback) {
    superAgent.post(`${API_PREFIX}quiz/${quizId}/submission`)
      .set('Content-Type', 'application/json')
      .send({userAnswer: _answer})
      .use(errorHandler)
      .end(callback);
  },

  onChangeAnswer: function (val) {
    _answer = val;
    this.trigger({
      userAnswer: _answer
    });
  },

  onSubmitPaper: function (programId, paperId) {
    var quizId = questionIds[_currentIndex].id;
    async.waterfall([
      (callback) => {
        this.onSaveUserAnswer(quizId, callback);
      }, (res, callback) => {
        superAgent.post(`${API_PREFIX}quiz/section/${sectionId}/submission`)
          .set('Content_Type', 'application/json')
          .use(errorHandler)
          .end(callback);
      }
    ], function (err, res) {
      if (err) {
        return;
      }
      if (res.statusCode === constant.httpCode.CREATED) {
        page('dashboard.html?programId=' + programId + '&paperId=' + paperId);
      }
    });
  },

  updateItem: function (questionId, callback) {
    superAgent.get(`${API_PREFIX}questions/${questionId}`)
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .end(callback);
  },

  onTimeOver: function () {
    this.onSubmitPaper();
    this.trigger({
      showModal: true
    });
  }

});

module.exports = LogicPuzzleStore;
