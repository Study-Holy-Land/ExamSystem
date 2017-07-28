'use strict';

var Reflux = require('reflux');
var StudentManagementAction = require('../../actions/user-center/student-management-action');
var request = require('superagent');
var noCache = require('superagent-no-cache');
var errorHandler = require('../../../../tools/error-handler.jsx');

var StudentManagementStore = Reflux.createStore({
  listenables: [StudentManagementAction],

  onGetStudents: function (callback) {
    let page = 1;
    request.get(API_PREFIX + 'students')
      .set('Content-Type', 'application/json')
      .use(noCache)
      .use(errorHandler)
      .query({
        page,
        pageCount: 15
      })
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.trigger({
            studentList: res.body
          }, callback);
        }
      });
  }
});

module.exports = StudentManagementStore;
