'use strict';

var Reflux = require('reflux');

var MessageManagementAction = Reflux.createActions([
  'findAll',
  'operateMessage'
]);

module.exports = MessageManagementAction;
