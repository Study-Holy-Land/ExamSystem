'use strict';

var mongoose = require('mongoose');

var mongoStatus = 'unconnected';
var start = function(mongoURL) {
  var conn = mongoose.connection;
  mongoose.Promise = global.Promise;

  mongoose.connect(mongoURL);

  conn.on('error', function(err) {
    mongoStatus = err;
  });

  conn.on('connected', function() {
    mongoStatus = 'connected';
  });

  conn.on('disconnected', function() {
    mongoStatus = 'disconnected';
  });
};

function status() {
  return {
    mongodb: mongoStatus
  };
}

module.exports = {
  start: start,
  status: status
};
