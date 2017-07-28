'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var token = new Schema({
  uuid: String,
  id: String,
  role: Array
});

module.exports = mongoose.model('token', token);
