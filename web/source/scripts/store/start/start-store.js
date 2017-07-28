'use strict';

var Reflux = require('reflux');
var StartActions = require('../../actions/start/start-actions');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');
var page = require('page');

var GetAccountStore = Reflux.createStore({
  listenables: [StartActions],

  onInit: function () {
    request.get(API_PREFIX + 'test/detail')
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .end((err, resp) => {
        if (err) {
          return;
        }
        if (resp.body.data === false) {
          page('user-center.html#userDetail');
        }
      });
  }
});

module.exports = GetAccountStore;
