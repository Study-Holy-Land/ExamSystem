'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
  groupId: Number
});

module.exports = mongoose.model('group', groupSchema);
