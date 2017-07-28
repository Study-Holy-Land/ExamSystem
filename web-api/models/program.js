const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  programId: Number,
  makerId: Number,
  name: String,
  description: String,
  uriEnable: Boolean,
  programCode: String,
  codeEnable: Boolean,
  orderEnable: Boolean,
  programType: String
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
