'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {QuizItem} = require('./quizItem');
var {QuizSubmit} = require('./quiz-submit');

var typeEnum = {
  values: ['logicPuzzle', 'homeworkQuiz', 'shortcutsPractise'],
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};

var paperSchema = new Schema({
  programId: Number,
  paperId: Number,
  userId: Number,
  paperUri: String,
  sections: [{
    sectionName:String,
    startTime: Number,
    endTime: Number,
    sectionId:Number,
    quizzes: [
      {
        quizId: {
          type: Schema.Types.ObjectId,
          ref: 'QuizItem'
        },
        submits: [{
          type: Schema.Types.ObjectId,
          ref: 'QuizSubmit'
        }]
      }
    ]
  }]
});

paperSchema.statics.findOrCreate = (condition, data, done) => {
  const model = mongoose.model('Paper');
  if (typeof data === 'function') {
    done = data;
    data = condition;
  }
  model.findOne(condition, (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
      return done(null, doc);
    }
    model.create(data, done);
  });
};

module.exports = mongoose.model('Paper', paperSchema); //eslint-disable-line