const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cheSchema = new Schema({
  cheId: String,
  name: String
});

module.exports = mongoose.model('che', cheSchema);
