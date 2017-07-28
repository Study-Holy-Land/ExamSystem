const async = require('async');
const superAgent = require('superagent');
const apiRequest = require('../services/api-request');
const constant = require('../mixin/constant');
const Token = require('../models/token');
const nodeUuid = require('node-uuid');
const secret = require('../mixin/weChat-secret').secret;

class WeChatLoginController {
  weChat(req, res, next) {
    let code = req.body.code;
    let unionid;
    async.waterfall([
      (done) => {
        superAgent.get('https://api.weixin.qq.com/sns/oauth2/access_token')
          .query({
            appid: 'wx0a53a01a2413d100',
            secret: secret,
            code: code,
            grant_type: 'authorization_code'
          })
          .end(done);
      },
      (res, done) => {
        unionid = JSON.parse(res.text).unionid;
        apiRequest.get('auth/thirdParty/weChat', {thirdPartyUserId: unionid}, done);
      },
      (result, done) => {
        if (result.body.userId) {
          apiRequest.get(`users/${result.body.userId}`, done);
        } else {
          done({status: constant.httpCode.NOT_FOUND}, null);
        }
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
          done(err, result);
        });
      },
      (result, done) => {
        apiRequest.get('users/' + result.body.id + '/detail', (err, res) => {
          result.body.isFinishedDetail = res.statusCode === constant.httpCode.OK ? false : checkDetail(res.body);
          done(err, result);
        });
      }
    ], (err, result) => {
      if (err && err.status === constant.httpCode.NOT_FOUND) {
        return res.status(constant.httpCode.NOT_FOUND).send({thirdPartyUserId: unionid});
      }

      if (err) {
        return next(err);
      }

      res.send({
        status: constant.httpCode.OK,
        isSuperAdmin: result.body.role.indexOf(9) !== -1,
        isFinishedDetail: result.body.isFinishedDetail
      });
    });
  }
}

function checkDetail(userDetatil) {
  for (let member in userDetatil) {
    if (userDetatil[member] === null) {
      return false;
    }
  }
  return true;
}

module.exports = WeChatLoginController;
