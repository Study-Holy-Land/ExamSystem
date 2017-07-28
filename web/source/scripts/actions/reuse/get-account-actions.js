'use strict';

var Reflux = require('reflux');

var getAccountActions = Reflux.createActions([
  'loadAccount',
  'logout'
]);

module.exports = getAccountActions;
