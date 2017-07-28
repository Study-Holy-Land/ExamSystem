'use strict';

var Reflux = require('reflux');

var BasicQuizActions = Reflux.createActions([
  'init',
  'submitAnswer',
  'onUpdateAnswer'
]);

module.exports = BasicQuizActions;
