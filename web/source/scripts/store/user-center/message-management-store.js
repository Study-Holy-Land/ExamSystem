'use strict';

var Reflux = require('reflux');
var MessageManagementAction = require('../../actions/user-center/message-management-action');
var request = require('superagent');
var noCache = require('superagent-no-cache');
var errorHandler = require('../../../../tools/error-handler.jsx');

var MessageManagementStore = Reflux.createStore({
  listenables: [MessageManagementAction],

  onFindAll: function (page) {
    request.get(`${API_PREFIX}messages`)
      .set('Content-Type', 'application/json')
      .query({
        page,
        pageCount: 10
      })
      .use(noCache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.trigger({
            messageList: res.body.message,
            totalPage: res.body.totalPage
          });
        }
      });
  },

  onOperateMessage: function (messageId, operation, currentPage) {
    request.put(`${API_PREFIX}messages/${messageId}/${operation}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (res.statusCode === 204) {
          this.onFindAll(currentPage);
        } else {
          throw err;
        }
      });
  }
});

module.exports = MessageManagementStore;
