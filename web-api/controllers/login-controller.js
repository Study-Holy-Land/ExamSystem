'use strict';

var constant = require('../mixin/constant');
var md5 = require('js-md5');
var validate = require('validate.js');
var constraint = require('../mixin/login-constraint');
var apiRequest = require('../services/api-request');
var async = require('async');
var Token = require('../models/token');
var nodeUuid = require('node-uuid');

function checkLoginInfo(account, password) {
  var pass = true;
  var valObj = {};

  valObj.email = account;
  valObj.mobilePhone = account;
  valObj.loginPassword = password;
  var result = validate(valObj, constraint);

  if (!(result.email || result.mobilePhone)) {
    pass = false;
  }

  if (password.length < constant.PASSWORD_MIN_LENGTH ||
    password.length > constant.PASSWORD_MAX_LENGTH) {
    pass = false;
  }
  return pass;
}

function checkDetail(userDetatil) {
  for (var member in userDetatil) {
    if (userDetatil[member] === null) {
      return false;
    }
  }
  return true;
}

function LoginController() {

}

LoginController.prototype.login = (req, res, next) => {
  var account = req.body.account;
  var password = req.body.password;
  var captcha = req.body.captcha;
  var identify = req.body.identity;
  var error = {};
  async.waterfall([
    (done) => {
      if (captcha !== req.session.captcha) {
        error.status = constant.httpCode.FORBIDDEN;
        done(error, null);
      } else {
        done(null, null);
      }
    }, (data, done) => {
      if (checkLoginInfo(account, password)) {
        password = md5(password);
        apiRequest.post('login', {email: account, password: password}, done);
      } else {
        error.status = constant.httpCode.UNAUTHORIZED;
        done(error, null);
      }
    }, (result, done) => {
      if (result.body.id && result.headers) {
        req.session.user = {
          id: result.body.id,
          role: result.body.role
        };
        const uuid = nodeUuid.v4();
        Token.update({
          id: result.body.id
        }, {$set: {uuid}}, {upsert: true}, (err) => {
          res.cookie('uuid', uuid, {path: '/'});
          res.cookie('authState', 200);
          done(err, result);
        });
      } else {
        error.status = constant.httpCode.UNAUTHORIZED;
        done(error, null);
      }
    }, (result, done) => {
      apiRequest.get('users/' + result.body.id + '/detail', (err, res) => {
        result.body.isFinishedDetail = res.statusCode === 404 ? false : checkDetail(res.body);
        result.identify = res.body.role.some((item) => item === 0);
        done(err, result);
      });
    }], (error, result) => {
    if (error !== null && error.status === constant.httpCode.FORBIDDEN) {
      res.send({status: constant.httpCode.FORBIDDEN});
      return;
    } else if (error !== null && error.status === constant.httpCode.UNAUTHORIZED) {
      res.send({status: constant.httpCode.UNAUTHORIZED});
      return;
    } else if (result.identify && identify === 'teacher') {
      return res.send({status: constant.httpCode.UNAUTHORIZED});
    } else if (result.status === constant.httpCode.OK) {
      res.send({
        status: constant.httpCode.OK,
        isSuperAdmin: result.body.role === '9',
        isFinishedDetail: result.body.isFinishedDetail
      });
      return;
    }
    return next(error);
  });
};

module.exports = LoginController;
