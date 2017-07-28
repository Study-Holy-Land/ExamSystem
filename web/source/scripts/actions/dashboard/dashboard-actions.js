'use strict';

var Reflux = require('reflux');

var DashboardActions = Reflux.createActions([
  'init',
  'getStatus',
  'showPrompt',
  'hidePrompt'
]);

module.exports = DashboardActions;
