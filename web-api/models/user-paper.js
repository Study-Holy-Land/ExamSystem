'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userPaperSchema = new Schema({
  userId: Number,
  papers: [{
    id: Number,
    sections: [{
      id: Number,
      description: String,
      quizzes: [{
        definition_uri: String,
        id: Number,
        items_uri: String
      }],
      sectionType: String,
      startTime: Number,
      endTime: Number
    }]
  }]
});

module.exports = mongoose.model('UserPaper', userPaperSchema);
