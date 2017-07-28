'use strict';

var Reflux = require('reflux');

var RegisterableAction = Reflux.createActions([
  'loadRegisterableState',
  'changeRegisterableState'
]);

module.exports = RegisterableAction;
