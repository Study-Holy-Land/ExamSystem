'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeworkInfoSchema = new Schema({
  userId: Number,
  homeworkId: Number
});

module.exports = mongoose.model('HomeworkInfo', homeworkInfoSchema);
