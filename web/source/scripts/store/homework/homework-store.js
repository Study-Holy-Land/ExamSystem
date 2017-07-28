'use strict';

require('es6-shim');
var nocache = require('superagent-no-cache');
var Reflux = require('reflux');
var HomeworkActions = require('../../actions/homework/homework-actions');
var superAgent = require('superagent');
var homeworkQuizzesStatus = require('../../../../mixin/constant').homeworkQuizzesStatus;
var errorHandler = require('../../../../tools/error-handler.jsx');
var async = require('async');
var page = require('page');
var getQueryString = require('../../../../tools/getQueryString');
var sectionId = getQueryString('sectionId');
var paperId = getQueryString('paperId');
var programId = getQueryString('programId');

var pollTimeout;
var TIMEOUT = 5000;

var HomeworkSidebarStore = Reflux.createStore({
  listenables: [HomeworkActions],

  init: function () {
    this.data = {};
  },

  hasTaskProcess () {
    return this.data.homeworkQuizzes.some((item) => {
      return item.status === homeworkQuizzesStatus.PROGRESS;
    });
  },

  pollData: function (quizId) {
    if (this.hasTaskProcess()) {
      pollTimeout = setTimeout(this.onInit(quizId), TIMEOUT);
    } else {
      pollTimeout && clearTimeout(pollTimeout);
    }
  },

  onInit: function (questionId) {
    async.waterfall([
      (done) => {
        superAgent.get(API_PREFIX + 'test/detail')
          .set('Content-Type', 'application/json')
          .use(nocache)
          .use(errorHandler)
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
        // console.log(data, '${API_PREFIX}test/detail');

        superAgent.get(`${API_PREFIX}timer/initSection/${sectionId}`)
          .set('Content-Type', 'application/json')
          .use(nocache)
          .use(errorHandler)
          .end(done);
      },
      (data, done) => {
        superAgent.get(`${API_PREFIX}programs/${programId}/papers/${paperId}/sections/${sectionId}/questionIds`)
          .set('Content-Type', 'application/json')
          .use(nocache)
          .use(errorHandler)
          .end(done);
      },

      (data, done) => {
        this.data.homeworkQuizzes = data.body;
        var orderId = window.location.hash.substr(1);
        orderId = parseInt(orderId) || 1;
        orderId = Math.max(orderId, 1);
        orderId = Math.min(orderId, this.data.homeworkQuizzes.length);
        this.data.orderId = orderId;

        done(null, {
          sectionId,
          orderId: orderId
        });
      },

      (query, done) => {
        superAgent.get(`${API_PREFIX}questions/${questionId}`)
          .set('Content-Type', 'application/json')
          .use(nocache)
          .use(errorHandler)
          .query(query)
          .end(done);
      }
    ], (err, data) => {
      if (err === true) {
        page('user-center.html#userDetail');
      }
      this.data.currentQuiz = data.body;
      this.trigger(this.data);
      this.pollData(questionId);
    });
  },

  onCreateTask: function (data) {
    var jsonData = Object.assign({
      paperId: paperId,
      quizId: this.data.homeworkQuizzes[this.data.orderId - 1].id,
      homeworkQuizUri: this.data.currentQuiz.uri
    }, data);
    async.waterfall([
      (done) => {
        superAgent.post(API_PREFIX + 'quiz/scoring')
          .set('Content-Type', 'application/json')
          .use(nocache)
          .use(errorHandler)
          .send(jsonData)
          .end(done);
      },

      (data, done) => {
        this.data.currentQuiz.status = data.body.status;
        this.data.currentQuiz.result = data.body.result;
        this.data.homeworkQuizzes[this.data.orderId - 1].status = data.body.status;
        done(null, null);
      }
    ], (err, data) => {
      if (err) {
        return;
      }
      this.trigger(this.data);
      this.pollData(this.data.homeworkQuizzes[this.data.orderId - 1].id);
    });
  },

  onChangeOrderId: function (orderId) {
    async.waterfall([
      (done) => {
        var orderId = window.location.hash.substr(1);
        orderId = parseInt(orderId) || 1;
        orderId = Math.max(orderId, 1);
        orderId = Math.min(orderId, this.data.homeworkQuizzes.length);
        this.data.orderId = orderId;

        done(null, {
          sectionId,
          orderId: orderId
        });
      },

      (query, done) => {
        let questionId = this.data.homeworkQuizzes.find((quiz, index) => {
          return index + 1 === orderId;
        }).id;
        superAgent.get(`${API_PREFIX}questions/${questionId}`)
          .set('Content-Type', 'application/json')
          .use(nocache)
          .use(errorHandler)
          .query(query)
          .end(done);
      }
    ], (err, data) => {
      if (err) {
        return;
      }
      this.data.currentQuiz = data.body;
      this.trigger(this.data);
    });
  }
});

module.exports = HomeworkSidebarStore;
