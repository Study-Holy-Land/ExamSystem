'use strict';

var Reflux = require('reflux');

var getInvitationCodeActions = Reflux.createActions([
  'getInvitationCode',
  'changeValue'
]);

module.exports = getInvitationCodeActions;
