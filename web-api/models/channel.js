'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var channelSchema = new Schema({
  name: String
});

module.exports = mongoose.model('channel', channelSchema);
