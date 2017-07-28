var mongoose = require('mongoose');
const config = require('config');
var mongoTools = require('./spec/support/fixture/mongo-tools');
mongoose.Promise = global.Promise;
mongoose.connect(config.get('database'));
mongoTools.refresh(() => {
  mongoose.connection.close(function() {
    process.exit(0);
  });
});
