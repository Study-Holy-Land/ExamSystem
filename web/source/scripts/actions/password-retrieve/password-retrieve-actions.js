'use strict';

var Reflux = require('reflux');

var passwordRetrieveActions = Reflux.createActions([
  'retrieve',
  'changeValue'
]);

module.exports = passwordRetrieveActions;
