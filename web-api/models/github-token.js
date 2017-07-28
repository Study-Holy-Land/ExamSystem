'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var githubToken = new Schema({
  id: String,
  githubToken: String
});

module.exports = mongoose.model('githubToken', githubToken);

