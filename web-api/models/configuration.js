'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigurationSchema = new Schema({
  registerable: Boolean,
  qaContent: String,
  qaResourceUrl: String
});

var Configuration = mongoose.model('Configuration', ConfigurationSchema);

module.exports = Configuration;
