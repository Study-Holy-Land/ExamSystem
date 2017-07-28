const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stackSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  description: String,
  definition: String,
  status: {
    type: Number,
    default: 0
  },
  result: {type: String, default: '排队中,请稍候...'},
  buildNumber: Number,
  jobName: {type: String, default: 'ADD_IMAGE'}
});

const Stack = mongoose.model('Stack', stackSchema);
module.exports = Stack;
