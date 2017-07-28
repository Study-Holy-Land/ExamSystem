'use strict';

var Reflux = require('reflux');
var DashboardActions = require('../../actions/dashboard/dashboard-actions');
var request = require('superagent');
var nocache = require('superagent-no-cache');
var errorHandler = require('../../../../tools/error-handler.jsx');
var page = require('page');
var async = require('async');
var getQueryString = require('../../../../tools/getQueryString');
var programId = getQueryString('programId');
var paperId = getQueryString('paperId');

var DashboardStore = Reflux.createStore({
  listenables: DashboardActions,

  onInit: function () {
    request.get(API_PREFIX + 'test/detail')
      .set('Content-Type', 'application/json')
      .use(nocache)
      .end((err, resp) => {
        if (err) {
          return;
        }
        if (resp.body.data === false) {
          page('user-center.html#userDetail');
          this.trigger({
            isGetStatus: false
          });
        } else {
          this.trigger({
            isGetStatus: true
          });
        }
      });
  },

  onGetStatus: function () {
    let programType = 'exam';
    async.waterfall([
      (done) => {
        request.get(API_PREFIX + 'user/programs')
          .set('Content-Type', 'application/json')
          .use(errorHandler)
          .end(done);
      },
      (res, done) => {
        programType = res.body.find(program => parseInt(programId) === program.programId).programType;
        done(null);
      },
      (done) => {
        request.get(`${API_PREFIX}programs/${programId}/papers/${paperId}/sections`)
          .use(errorHandler)
          .end(done);
      }
    ], (err, res) => {
      if (err) {
        return;
      }
      this.trigger({
        sections: res.body.data,
        programType
      });
    });
  },

  submitPaper: function () {
    request.post(API_PREFIX + 'logic-puzzle')
      .set('Content_Type', 'application/json')
      .use(errorHandler)
      .end();
  }

});

module.exports = DashboardStore;
