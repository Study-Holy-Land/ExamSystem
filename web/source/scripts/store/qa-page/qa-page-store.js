'use strict';

var Reflux = require('reflux');
var QAPageActions = require('../../actions/qa-page/qa-page-actions');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');

var GetAccountStore = Reflux.createStore({
  listenables: [QAPageActions],

  onLoadQAContent: function () {
    request.get(API_PREFIX + 'qa')
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        this.trigger({
          qaContent: res.body.qaContent
        });
      });
  }
});

module.exports = GetAccountStore;
