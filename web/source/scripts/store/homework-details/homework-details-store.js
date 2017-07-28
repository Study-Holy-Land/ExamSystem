'use strict';

var Reflux = require('reflux');
var HomeworkDetailsActions = require('../../actions/homework-details/homework-details-actions');
var superAgent = require('superagent');
var nocache = require('superagent-no-cache');
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');

var HomeworkDetailsStore = Reflux.createStore({
  listenables: [HomeworkDetailsActions],

  onLoadUserDetail: function (userId) {
    var url = API_PREFIX + 'user/' + userId + '/homework-details';

    superAgent.get(url)
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .use(nocache)
      .end((err, res) => {
        if (err || res.status !== constant.httpCode.OK) {
          return;
        }
        this.trigger({userDetail: res.body.userInfo});
      });
  }

});

module.exports = HomeworkDetailsStore;
