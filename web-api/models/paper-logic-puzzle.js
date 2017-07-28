'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperLogicPuzzleSchema = new Schema({
  'question': String,
  'description': String,
  'id': Number,
  'chartPath': String,
  'initializedBox': String
});

paperLogicPuzzleSchema.statics.findOrCreate = (condition, data, done) => {
  const model = mongoose.model('PaperLogicPuzzle');
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

module.exports = mongoose.model('PaperLogicPuzzle', paperLogicPuzzleSchema);

