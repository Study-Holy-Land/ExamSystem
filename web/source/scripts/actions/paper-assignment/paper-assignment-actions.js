'use strict';

var Reflux = require('reflux');

var PaperAssignmentAction = Reflux.createActions([
  'addLink',
  'getLinks',
  'deleteLink',
  'getPaperName'
]);

module.exports = PaperAssignmentAction;
