'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userPaperFormSchema = new Schema({
  userId: Number,
  programId: Number,
  paperId: Number
});

module.exports = mongoose.model('UserPaperForm', userPaperFormSchema);
