'use strict';

var Reflux = require('reflux');
var QAPageUpdateAction = require('../../actions/admin/qa-page-update-actions');
var request = require('superagent');
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');

var QAPageUpdateStore = Reflux.createStore({
  listenables: QAPageUpdateAction,

  onUpdateQAPage: function (url) {
    request.put(API_PREFIX + 'qa/update')
      .set('Content-Type', 'application/json')
      .send({qaInfoAddress: url})
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        this.trigger({
          updateStatus: res.body.status === constant.httpCode.OK ? 'success' : 'failed'
        });
      });
  },
  onInit: function () {
    request.get(API_PREFIX + 'qa')
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        this.trigger(res.body);
      });
  }
});

module.exports = QAPageUpdateStore;
