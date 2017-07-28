'use strict';

var Reflux = require('reflux');
var MentorManagementAction = require('../../actions/user-center/mentor-management-action');
var request = require('superagent');
var noCache = require('superagent-no-cache');
var errorHandler = require('../../../../tools/error-handler.jsx');

var MentorManagementStore = Reflux.createStore({
  listenables: [MentorManagementAction],

  onGetMentors: function (callback) {
    request.get(`${API_PREFIX}mentors`)
      .set('Content-Type', 'application/json')
      .use(noCache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.trigger({
            mentorList: res.body
          }, callback);
        }
      });
  },

  onCreateMessages: function (mentorId) {
    request.post(`${API_PREFIX}messages`)
      .set('Content-Type', 'application/json')
      .send({to: mentorId, type: 'INVITATION'})
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          request.get(`${API_PREFIX}mentors`)
            .set('Content-Type', 'application/json')
            .use(noCache)
            .use(errorHandler)
            .end((err, res) => {
              if (err) {
                throw err;
              } else {
                this.trigger({
                  mentorList: res.body
                });
              }
            });
        }
      });
  },

  onSearchMentor: function (email) {
    request.get(API_PREFIX + 'mentors/search?email=' + email)
      .set('Content-Type', 'application/json')
      .use(noCache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.trigger({
            mentorSearchList: res.body.items,
            searchResult: (res.body.totalCount === 0)
          });
        }
      });
  }
});

module.exports = MentorManagementStore;
