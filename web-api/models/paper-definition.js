'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperDefinitionSchema = new Schema({
  paperName: String,
  isDistributed: Boolean,
  distributedTime: Number,
  description: String,
  programId: Number,
  makerId: Number,
  createTime: Number,
  updateTime: Number,
  isDeleted: Boolean,
  uri: String,
  sections: [
    {
      title: String,
      quizzes: Object,
      type: String
    }
  ]
}, {typeKey: '$type'});

module.exports = mongoose.model('PaperDefinition', paperDefinitionSchema);
