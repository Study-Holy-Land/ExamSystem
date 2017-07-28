'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var _ = require('lodash');
var validate = require('validate.js');
var userConstraint = require('../../mixin/user-detail-constraint');
var passwordConstraint = require('../../mixin/password-constraint');
var newPasswordConstraint = require('../../mixin/confirm-password-constraint');
var md5 = require('js-md5');
var constant = require('../../mixin/constant');
var apiRequest = require('../../services/api-request');
var Token = require('../../models/token');
var UserInfo = require('../../models/user-info');
var nodeUuid = require('node-uuid');
const ProgramService = require('../../services/program-service/index');
const programService = new ProgramService();
var httpStatus = require('../../mixin/constant').httpCode;

router.get('/', (req, res) => {
  if (req.session.user) {
    var userId = req.session.user.id;
    var result;
    async.waterfall([
      (done) => {
        apiRequest.get('users/' + userId, done);
      },
      (resp, done) => {
        if (resp.status === constant.httpCode.OK) {
          result = _.assign(resp.body);
        } else {
          throw new Error();
        }
        done(null, result);
      },
      (result, done) => {
        UserInfo.findOne({userId}, (err, doc) => {
          if (err) {
            return done(err, null);
          }
          if (doc) {
            result = _.assign(result, doc.toJSON());
          }
          done(null, result);
        });
      },
      (result, done) => {
        apiRequest.get('users/' + userId + '/detail', done);
      },
      (resp, done) => {
        result = _.assign(result, resp.body);
        done(null, result);
      }
    ], (err) => {
      if (err && err.status !== constant.httpCode.NOT_FOUND) {
        res.status(err.status);
        res.send({
          status: err.status
        });
      } else {
        res.send({
          status: constant.httpCode.OK,
          data: result
        });
      }
    });
  } else {
    res.send({status: constant.httpCode.ACCEPTED});
  }
});

router.put('/update', (req, res, next) => {
  var userId = req.session.user.id;
  var userInfo = req.body.data;
  var someUserInfo = {
    userId: userId,
    channel: userInfo.channel
  };

  async.waterfall([
    (done) => {
      UserInfo.findOneAndUpdate({userId}, someUserInfo, (err, doc) => {
        if (err) {
          return done(err, null);
        }
        if (!doc) {
          return UserInfo.create(someUserInfo, done);
        }
        done(null, doc);
      });
    },
    (docs, done) => {
      delete userInfo.channel;
      var result = _.assign({userId: userId}, userInfo);
      if (validate(result, userConstraint) === undefined && result.gender !== '') {
        var url = 'users/' + userId + '/detail';
        apiRequest.put(url, result, (err, resp) => {
          return done(err, resp);
        });
      } else {
        return done({status: constant.httpCode.BAD_REQUEST}, null);
      }
    }
  ], (err, result) => {
    if (err && err.status === constant.httpCode.BAD_REQUEST) {
      return res.send({status: constant.httpCode.BAD_REQUEST});
    }
    if (err) {
      return next(err);
    }
    if (result === undefined) {
      return res.send({
        status: constant.httpCode.INTERNAL_SERVER_ERROR
      });
    }
    if (result && result.status) {
      return res.send({status: result.status});
    }
  });
});

router.put('/change-password', (req, res, next) => {
  var userId = req.session.user.id;
  var passwordInfo = req.body.data;

  if (validate(passwordInfo, passwordConstraint) === undefined &&
    validate(passwordInfo, newPasswordConstraint) === undefined &&
    passwordInfo.newPassword === passwordInfo.confirmPassword) {
    var partResult = {};

    partResult.oldPassword = md5(passwordInfo.oldPassword);
    partResult.password = md5(passwordInfo.newPassword);
    var url = 'users/' + userId + '/password';
    apiRequest.put(url, partResult, (err, resp) => {
      if (err && err.status === constant.httpCode.BAD_REQUEST) {
        res.status(constant.httpCode.BAD_REQUEST);
        return res.send({
          status: constant.httpCode.BAD_REQUEST
        });
      } else if (err) {
        return next(err);
      }
      if (resp === undefined) {
        res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
        res.send({
          status: constant.httpCode.INTERNAL_SERVER_ERROR
        });
      } else if (resp.status === constant.httpCode.OK) {
        res.send({
          status: constant.httpCode.OK
        });
      } else {
        res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
        res.send({
          status: constant.httpCode.INTERNAL_SERVER_ERROR
        });
      }
    });
  } else {
    res.send({
      status: constant.httpCode.PRECONDITION_FAILED
    });
  }
});

router.post('/weChat', (req, res, next) => {
  let someInfo = {channel: req.body.userInfo.channel};
  delete req.body.userInfo.channel;
  async.waterfall([
    (done) => {
      apiRequest.get('users/verification', {
        field: 'mobilePhone',
        value: req.body.userInfo.mobilePhone
      }, (err, data) => {
        if (err) {
          return done(err, null);
        }
        if (data.body.uri) {
          return done({msg: 'mobilePhone Exist'}, null);
        }
        return done(null, data);
      });
    },
    (data, done) => {
      apiRequest.get('users/verification', {field: 'email', value: req.body.userInfo.email}, (err, data) => {
        if (err) {
          return done(err, null);
        }
        if (data.body.uri) {
          return done({msg: 'email Exist'}, null);
        }
        return done(null, data);
      });
    },
    (programId, done) => {
      Object.assign(req.body.userInfo, {password: '12345678'});
      apiRequest.post('auth/thirdParty/weChat', req.body.userInfo, done);
    },
    (data, done) => {
      if (data.statusCode === constant.httpCode.CREATED) {
        apiRequest.get(data.body.uri, done);
      } else {
        return done({status: constant.httpCode.BAD_REQUEST}, null);
      }
    },
    (result, done) => {
      someInfo.userId = result.body.id;
      UserInfo.findOneAndUpdate({userId: result.body.id}, someInfo, (err, doc) => {
        if (err) {
          return done(err, null);
        }
        if (!doc) {
          return UserInfo.create(someInfo, (err) => {
            done(err, result);
          });
        }
        done(null, result);
      });
    },
    (result, done) => {
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
        res.cookie('role', result.body.role);
        return done(err, result);
      });
    },
    (result, done) => {
      let addProgramFunc;
      let programErrMessage = {};
      req.body = req.body.userInfo;

      if (req.body.programCode && req.body.programCode.length === 8) {
        addProgramFunc = programService.addProgramByProgramCode;
      } else if (req.body.programCode && req.body.programCode.length === 12) {
        req.body.invitationCode = req.body.programCode;
        addProgramFunc = programService.addProgramByInvitationCode;
      }
      if (addProgramFunc) {
        addProgramFunc(req, (err, doc) => {
          const status = doc && doc.status === 1 ? httpStatus.FORBIDDEN : '';
          let errStatus = err && err.status ? err.status : '';
          programErrMessage.status = status || errStatus || httpStatus.CREATED;
          done(null, {result, programErrMessage});
        });
      } else {
        programErrMessage.status = httpStatus.NOT_FOUND;
        result = {result, programErrMessage};
        done(null, result);
      }
    },
    (result, done) => {
      apiRequest.get('users/' + req.session.user.id + '/detail', (err, res) => {
        result.isFinishedDetail = res.statusCode === constant.httpCode.NOT_FOUND ? false : checkDetail(res.body);
        done(err, result);
      });
    }
  ], (err, result) => {
    if (err && (err.msg === 'mobilePhone Exist' || err.msg === 'email Exist')) {
      return res.status(constant.httpCode.DUPLICATE_CONTENT).send({msg: err.msg});
    }

    if (err) {
      return next(err);
    }
    res.clearCookie('program', {path: '/'});
    res.send({
      status: constant.httpCode.OK,
      isSuperAdmin: result.result.body.role.indexOf(9) !== -1,
      isFinishedDetail: result.isFinishedDetail,
      programErrMessage: result.programErrMessage.status
    });
  });
});

function checkDetail(userDetatil) {
  for (let member in userDetatil) {
    if (userDetatil[member] === null) {
      return false;
    }
  }
  return true;
}

module.exports = router;
