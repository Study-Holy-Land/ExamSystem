'use strict';

var async = require('async');
var apiRequest = require('../services/api-request');
var emailServer = require('../services/sendCloud');
var constant = require('../mixin/constant');
var config = require('config');
var emailDomain = config.get('domain');
var pathPrefix = config.get('path_prefix');
var md5 = require('js-md5');

function PasswordController() {

}

PasswordController.prototype.retrieve = (req, res) => {
  var retrieveUrl = 'users/password/retrieve';
  var email = req.query.email;
  var role = req.query.role;
  var query = {
    field: 'email',
    value: email
  };
  var title = '找回密码';

  async.waterfall([
    (done) => {
      apiRequest.get(retrieveUrl, query, done);
    },
    (result, done) => {
      var status = parseInt(result.body.status);

      if (status === constant.httpCode.OK) {
        var token = result.body.token;
        var linkAddress = emailDomain + pathPrefix + 'password-reset.html?token=' + token + '&type=' + role;
        emailServer.sendEmail(linkAddress, title, email, (err, status) => {
          if (err) {
            done(true, null);
          } else {
            done(null, null);
          }
        });
      } else {
        done(true, null);
      }
    }
  ], (err, data) => {
    if (err) {
      res.send({status: constant.httpCode.NOT_FOUND});
    } else {
      res.send({status: constant.httpCode.OK});
    }
  });
};

PasswordController.prototype.reset = (req, res) => {
  var retrieveUrl = 'users/password/reset';
  var newPassword = md5(req.body.newPassword);

  var token = req.body.token;
  var query = {
    newPassword: newPassword,
    token: token
  };

  apiRequest.post(retrieveUrl, query, (err, result) => {
    if (err) {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    } else {
      res.send({status: parseInt(result.body.status)});
    }
  });
};

module.exports = PasswordController;
