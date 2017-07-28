'use strict';

var Reflux = require('reflux');
var PasswordActions = require('../../actions/reuse/password-actions');

var UserDetailStore = Reflux.createStore({
  listenables: [PasswordActions],

  onChangeNewPassword: function (passwordObj) {
    this.trigger(passwordObj);
  },

  onGetPasswordError: function (passwordError) {
    this.trigger(passwordError);
  },

  onSubmitEvent: function (evt) {
    this.trigger({event: evt});
  }
});

module.exports = UserDetailStore;
