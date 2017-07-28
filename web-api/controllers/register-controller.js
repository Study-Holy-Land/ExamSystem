'use strict';

var lang = require('..//mixin/lang-message/chinese');
var constant = require('../mixin/constant').backConstant;
var async = require('async');
var validate = require('validate.js');
var md5 = require('js-md5');
var constraint = require('../mixin/register-constraint');
var httpStatus = require('../mixin/constant').httpCode;
var apiRequest = require('../services/api-request');
var configuration = require('../models/configuration');
var UserChannel = require('../models/user-channel');
var mongoose = require('mongoose');
var Token = require('../models/token');
var nodeUuid = require('node-uuid');
const ProgramService = require('../services/program-service/index');
const programService = new ProgramService();

function checkRegisterInfo(registerInfo) {
  var pass = true;

  var valObj = {};
  valObj.email = registerInfo.email;
  valObj.mobilePhone = registerInfo.mobilePhone;
  valObj.password = registerInfo.password;

  var result = validate(valObj, constraint);

  if (result !== undefined) {
    pass = false;
  }

  if (registerInfo.password.length < constant.PASSWORD_MIN_LENGTH ||
    registerInfo.password.length > constant.PASSWORD_MAX_LENGTH) {
    pass = false;
  }
  return pass;
}

function RegisterController() {

}

RegisterController.prototype.register = (req, res, next) => {
  var registerInfo = req.body.registerInfo;
  var error = {};
  if (checkRegisterInfo(registerInfo)) {
    var isMobilePhoneExist = false;
    var isEmailExist = false;
    var isCaptchaError = false;

    async.waterfall([
      (done) => {
        configuration.findOne({}, (err, data) => {
          if (err) {
            return next(err);
          }
          if (!data.registerable) {
            error.status = httpStatus.UNAUTHORIZED; //  401 未开放注册
            done(error, data);
          } else {
            done(null, null);
          }
        });
      },
      (data, done) => {
        if (registerInfo.captcha !== req.session.captcha) {
          error.status = httpStatus.FORBIDDEN;  //  403 验证码错误
          isCaptchaError = true;
          done(error, null);
        } else {
          done(null, null);
        }
      }, (data, done) => {
        apiRequest.get('users', {field: 'mobilePhone', value: registerInfo.mobilePhone}, (err, resp) => {
          if (resp.body.uri) {
            isMobilePhoneExist = true;
          }
          done(err, resp);
        });
      }, (data, done) => {
        apiRequest.get('users', {field: 'email', value: registerInfo.email}, (err, resp) => {
          if (resp.body.uri) {
            isEmailExist = true;
          }
          if (isMobilePhoneExist || isEmailExist) {
            done(true, resp);
          } else {
            done(err, resp);
          }
        });
      },
      (data, done) => {
        delete registerInfo.captcha;
        registerInfo.password = md5(registerInfo.password);
        apiRequest.post('register', registerInfo, done);
      },
      (data, done) => {
        res.cookie('id', data.body.id);
        if (req.cookies.channel !== '') {
          var userChannel = new UserChannel({
            userId: data.body.id,
            channelId: new mongoose.Types.ObjectId(req.cookies.channel)
          });
          userChannel.save((err) => {
            done(err, null);
          });
        } else {
          done(null, null);
        }
      },
      (data, done) => {
        apiRequest.post('login', {email: registerInfo.email, password: registerInfo.password}, done);
      },
      (data, done) => {
        if (data.body.id && data.headers) {
          req.session.user = {
            id: data.body.id,
            role: data.body.role,
            userInfo: data.body.userInfo
          };
          const uuid = nodeUuid.v4();
          Token.update({id: data.body.id}, {$set: {uuid}}, {upsert: true}, (err) => {
            res.cookie('uuid', uuid, {path: '/'});
            res.cookie('authState', 200);
            return done(err, data);
          });
        } else {
          done(null, data);
        }
      },
      (data, done) => {
        let addProgramFunc;
        let programErrMessage = {};
        if (req.body.programCode && req.body.programCode.length === 8) {
          addProgramFunc = programService.addProgramByProgramCode;
        } else if (req.body.invitationCode && req.body.invitationCode.length === 12) {
          addProgramFunc = programService.addProgramByInvitationCode;
        }
        if (addProgramFunc) {
          addProgramFunc(req, (err, doc) => {
            const status = doc && doc.status === 1 ? httpStatus.FORBIDDEN : '';
            let errStatus = err && err.status ? err.status : '';
            programErrMessage.status = status || errStatus || httpStatus.CREATED;
            done(null, {data, programErrMessage});
          });
        } else {
          programErrMessage.status = httpStatus.NOT_FOUND;
          const result = {data, programErrMessage};
          done(null, result);
        }
      }
    ],
      (err, result) => {
        res.clearCookie('program', {path: '/'});
        const data = result.data;
        if (err !== null && err.status === httpStatus.UNAUTHORIZED) {
          res.send({
            status: constant.FORBIDDEN,
            registerable: data.registerable,
            programErrMessage: result.programErrMessage
          });
        } else if (err !== null && err.status === httpStatus.FORBIDDEN) {
          res.send({
            status: constant.FAILING_STATUS,
            message: lang.EXIST,
            data: {
              isEmailExist: isEmailExist,
              isMobilePhoneExist: isMobilePhoneExist,
              isCaptchaError: isCaptchaError
            },
            programErrMessage: result.programErrMessage
          });
        } else if (err) {
          return next(err);
        } else {
          res.send({
            status: data.status,
            programErrMessage: result.programErrMessage
          });
        }
      }
    );
  }
}
;

RegisterController.prototype.valdateMobilePhone = (req, res, next) => {
  apiRequest.get('users/verification', {field: 'mobilePhone', value: req.query.mobilePhone}, (err, result) => {
    if (!result) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.send();
      return next(err);
    }
    if (result.body.uri) {
      res.send({
        status: constant.SUCCESSFUL_STATUS
      });
    } else {
      res.send({
        status: constant.FAILING_STATUS
      });
    }
  });
};

RegisterController.prototype.valdateEmail = (req, res, next) => {
  apiRequest.get('users/verification', {field: 'email', value: req.query.email}, (err, result) => {
    if (!result) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.send();
      return next(err);
    }
    if (result.body.uri) {
      res.send({
        status: constant.SUCCESSFUL_STATUS
      });
    } else {
      res.send({
        status: constant.FAILING_STATUS
      });
    }
  });
};

RegisterController.prototype.registerable = (req, res, next) => {
  async.waterfall([
    (done) => {
      configuration.findOne({}, done);
    }], (err, data) => {
    if (err) return next(err);
    data = data || {registerable: true};
    res.send({
      registerable: data.registerable,
      status: constant.OK
    });
  });
};

module.exports = RegisterController;
