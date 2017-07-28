var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeworkDefinition = new Schema({
  description: String,
  makerId: Number,
  status: {
    type: Number,
    default: 1
  },
  answerPath: String,
  createTime: Number,
  isDeleted: Boolean,
  uri: String,
  evaluateScript: String,
  templateRepository: String,
  result: {type: String, default: '排队中,请稍候...'},
  buildNumber: Number,
  jobName: {type: String, default: 'ADD_HOMEWORK'},
  name: {
    type: String,
    unique: true
  },
  definitionRepo: String,
  stackId: Number
});

module.exports = mongoose.model('HomeworkDefinition', homeworkDefinition);

