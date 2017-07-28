'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperAssignmentSchema = new Schema({
  phoneNumber: String,
  paperName: String,
  paperId: Number
});

module.exports = mongoose.model('PaperAssignment', paperAssignmentSchema);
