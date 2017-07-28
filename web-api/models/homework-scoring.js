'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeWorkScoringSchema = new Schema({
  userAnswerRepo: String,
  status: {type: Number, default: 3},
  result: {type: String, default: '排队中,请稍候...'},
  version: String,
  branch: {type: String, defaultsTo: 'master'},
  startTime: Number,
  commitTime: {type: Number, default: new Date().getTime() / 1000},
  homeworkDetail: String,
  callbackURL: String,
  buildNumber: Number,
  jobName: {type: String, default: 'HOMEWORK_SCORING'}
});

module.exports = mongoose.model('homeworkScoring', homeWorkScoringSchema);
