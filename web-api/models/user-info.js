var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userInfoSchema = new Schema({
  userId: String,
  channel: Object
});

var UserInfo = mongoose.model('UserInfo', userInfoSchema);
module.exports = UserInfo;
