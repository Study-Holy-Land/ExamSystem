'use strict';

var Reflux = require('reflux');

var passwordResetActions = Reflux.createActions([
  'reset',
  'changeValue',
  'getError'
]);

module.exports = passwordResetActions;
