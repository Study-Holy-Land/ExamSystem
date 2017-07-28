'use strict';

var Reflux = require('reflux');

var PasswordActions = Reflux.createActions([
  'changeNewPassword',
  'getPasswordError',
  'submitEvent'
]);

module.exports = PasswordActions;
