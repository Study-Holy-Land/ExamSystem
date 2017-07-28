const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invitationCodeSchema = new Schema({
  programId: Number,
  invitationCode: String,
  status: Number
});

const InvitationCode = mongoose.model('InvitationCode', invitationCodeSchema);

module.exports = InvitationCode;
