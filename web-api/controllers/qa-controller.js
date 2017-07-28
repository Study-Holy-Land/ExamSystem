'use strict';

var constant = require('../mixin/constant');
var Configuration = require('../models/configuration');
var async = require('async');
var request = require('superagent');

function QAController() {
}

QAController.prototype.loadQAInfo = (req, res, next) => {
  Configuration.findOne({}, (err, configuration) => {
    if (err) {
      return next(err);
    }
    res.send(configuration);
  });
};

QAController.prototype.updateQAInfo = (req, res, next) => {
  var qaInfoAddress = req.body.qaInfoAddress;

  async.waterfall([
    (done) => {
      request
        .get(qaInfoAddress)
        .set('Content-Type', 'application/json')
        .end(done);
    },

    (result, done) => {
      Configuration.findOne({}, (err, configuration) => {
        if (err) {
          return next(err);
        }
        configuration.qaContent = result.text;
        configuration.qaResourceUrl = qaInfoAddress;
        configuration.save(done);
      });
    }
  ], (err) => {
    if (err) {
      return next(err);
    }

    res.send({status: constant.httpCode.OK});
  });
};

module.exports = QAController;
