const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCheSchema = new Schema({
  userId: Number,
  che: {
    type: Schema.Types.ObjectId,
    ref: 'che'
  }
});

module.exports = mongoose.model('userChe', userCheSchema);

