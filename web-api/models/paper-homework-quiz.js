'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperHomeworkQuizSchema = new Schema({
  'homeworkName': String,
  'evaluateScript': String,
  'templateRepository': String,
  'createTime': Number,
  'description': String,
  'id': Number,
  'type': String,
  'uri': String
});

paperHomeworkQuizSchema.statics.findOrCreate = (condition, data, done) => {
  const model = mongoose.model('PaperHomeworkQuiz');
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

module.exports = mongoose.model('PaperHomeworkQuiz', paperHomeworkQuizSchema);
