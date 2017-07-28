'use strict';

var Reflux = require('reflux');

var UserCenterActions = Reflux.createActions([
  'loadUserDetail',
  'pathChange',
  'updateUserDetail',
  'changeState',
  'changeGender',
  'validateGender',
  'checkGender',
  'loadResult',
  'loadMentorManagement',
  'loadStudentManagement',
  'loadMessage',
  'changeChannelsInfo'
]);

module.exports = UserCenterActions;
