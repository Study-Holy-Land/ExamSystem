'use strict';

var Reflux = require('reflux');

var MentorManagementAction = Reflux.createActions([
  'getMentors',
  'searchMentor',
  'createMessages'

]);

module.exports = MentorManagementAction;
