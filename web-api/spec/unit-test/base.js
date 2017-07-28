var mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = global.Promise;

before(()=> {
  mongoose.connect(config.get('database'));
});