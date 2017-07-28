'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userChannelSchema = new Schema({
  userId: Number,
  channelId: {type: Schema.Types.ObjectId, ref: 'channel'}
});

module.exports = mongoose.model('userChannel', userChannelSchema);
