'use strict';

var Reflux = require('reflux');

var LoginActions = Reflux.createActions([
  'login',
  'setCaptchaError'
]);

module.exports = LoginActions;
