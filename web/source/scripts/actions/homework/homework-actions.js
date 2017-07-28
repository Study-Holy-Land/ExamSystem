'use strict';

var Reflux = require('reflux');

var HomeworkActions = Reflux.createActions([
  'init',
  'changeOrderId',
  'createTask'
]);

module.exports = HomeworkActions;
