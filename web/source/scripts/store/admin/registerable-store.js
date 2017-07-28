'use strict';

var Reflux = require('reflux');
var RegisterableAction = require('../../actions/admin/registerable-actions');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');

var RegisterableStore = Reflux.createStore({
  listenables: RegisterableAction,

  onLoadRegisterableState: function () {
    request.get(API_PREFIX + 'admin/registerable')
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .end((err, res) => {
        if (!err) {
          this.trigger({
            registerable: res.body.configuration.registerable
          });
        }
      });
  },

  onChangeRegisterableState: function (value) {
    request.post(API_PREFIX + 'admin/registerable')
      .set('Content-Type', 'application/json')
      .send({value: value})
      .use(errorHandler)
      .end((err, res) => {
        if (!err) {
          this.trigger({
            registerable: res.body.configuration.registerable
          });
        }
      });
  }

});

module.exports = RegisterableStore;
