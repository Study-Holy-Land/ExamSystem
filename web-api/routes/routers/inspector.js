'use strict';

var express = require('express');
var router = express.Router();
// var request = require('superagent');
var async = require('async');
var apiRequest = require('../../services/api-request');
var mongoConn = require('../../services/mongo-conn');

function getInfoFromApi(done) {
  apiRequest.get('inspector', function(err, resp) {
    var data;
    if (err) {
      data = {api: err};
    } else {
      data = resp.body;
    }
    done(null, data);
  });
}

function getMongoInfo(done) {
  done(null, mongoConn.status());
}

// function getTaskQueueInfo(done) {
//   request.get(config.taskServer + 'inspector')
//       .set('Content-Type', 'application/json')
//       .query({'hook': config.appServer})
//       .end(function(err, resp) {
//         var data;
//         if (err) {
//           data = {'task-queue': err};
//         } else {
//           data = resp.body;
//         }
//         done(null, data);
//       });
// }

router.get('/', function(req, res, next) {
  var data = {app: 'connected'};

  async.parallel([
    getInfoFromApi,
    getMongoInfo
  ], function(err, result) {
    if (err) {
      return next(err);
    }
    result.forEach(function(v, k) {
      data = Object.assign(data, v);
    });
    res.send(data);
  });
});

module.exports = router;
