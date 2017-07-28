'use strict';

var Reflux = require('reflux');
var passwordResetActions = require('../../actions/password-retrieve/password-reset-actions');
var request = require('superagent');
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');

var passwordResetStore = Reflux.createStore({
  listenables: passwordResetActions,

  onReset: function (newPassword, token) {
    request.post(API_PREFIX + 'password/reset')
      .set('Content-Type', 'application/json')
      .send({
        newPassword: newPassword,
        token: token
      })
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        if (res.body.status === constant.httpCode.CREATED) {
          this.trigger({
            resetFailed: false,
            showMessage: true
          });
        } else if (res.body.status === constant.httpCode.PRECONDITION_FAILED) {
          this.trigger({
            clickable: false,
            resetFailed: 'timeOut',
            showMessage: false
          });
        } else {
          this.trigger({
            clickable: false,
            resetFailed: 'wrongUrl',
            showMessage: false
          });
        }
      });
  },

  onChangeValue: function (name, value) {
    this.trigger({[name]: value});
  },

  onGetError: function (value) {
    this.trigger(value);
  }
});

module.exports = passwordResetStore;
