const async = require('async');
const apiRequest = require('../services/api-request');
const constant = require('../mixin/constant');
const md5 = require('js-md5');
const backConstant = require('../mixin/constant').backConstant;

class RoleManagementController {
  getUsers(req, res, next) {
    const result = {};
    let pageCount = req.query.pageCount || 15;
    let page = req.query.page || 1;
    let queryData = {
      page,
      pageCount
    };
    if (req.query.role) {
      queryData.role = req.query.role;
    }

    async.waterfall([
      (done) => {
        apiRequest.get('users', queryData, done);
      },
      (resp, done) => {
        result.totalPage = Math.ceil((resp.body.totalCount || 1) / pageCount);
        result.data = resp.body.items;
        done(null, null);
      },
      (result, done) => {
        apiRequest.get('users/roleCount', done);
      }
    ], (err, resp) => {
      if (err) {
        return next(err);
      }

      result.totalCount = resp.body.totalCount;
      result.roleCount = resp.body.roleCount;
      return res.send(result);
    });
  }

  updateUsers(req, res, next) {
    const id = req.params.id;
    const userInfo = req.body;
    const mobilePhone = userInfo.mobilePhone;

    async.waterfall([
      (done) => {
        apiRequest.get(`users/${id}`, done);
      },
      (doc, done) => {
        if (doc.body.mobilePhone !== mobilePhone) {
          return apiRequest.get('users/verification', {field: 'mobilePhone', value: mobilePhone}, done);
        }
        return done(null, doc);
      },
      (doc, done) => {
        if (doc.body.uri) {
          return done({status: backConstant.MOBILE_PHONE_REAPET}, null);
        }
        if (userInfo.password !== '') {
          userInfo.password = md5(userInfo.password);
        } else {
          userInfo.password = null;
        }

        apiRequest.put(`users?id=${id}`, userInfo, done);
      }
    ], (err, result) => {
      if (err && err.status === backConstant.MOBILE_PHONE_REAPET) {
        return res.send({mobilePhoneError: constant.roleValidate.MOBILE_PHONE_REPEAT});
      }
      if (err) {
        return next(err);
      }
      if (!result) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    });
  }

  createUser(req, res, next) {
    const email = req.body.email;
    const mobilePhone = req.body.mobilePhone;
    async.waterfall([
      (done) => {
        apiRequest.get('users/verification', {field: 'email', value: email}, done);
      },
      (docs, done) => {
        if (docs.body.uri) {
          return done({status: backConstant.EMAIL_REPEAT}, null);
        }
        apiRequest.get('users/verification', {field: 'mobilePhone', value: mobilePhone}, done);
      },
      (docs, done) => {
        if (docs.body.uri) {
          return done({status: backConstant.MOBILE_PHONE_REAPET}, null);
        }
        const password = md5(req.body.password);
        const createDate = parseInt(new Date().getTime() /
          constant.time.MILLISECOND_PER_SECONDS);
        const userInfo = Object.assign({}, req.body, {createDate, password});
        apiRequest.post('users', userInfo, done);
      }
    ], (err) => {
      if (err && err.status === backConstant.EMAIL_REPEAT) {
        return res.send({emailError: constant.roleValidate.EMAIL_REPEAT});
      }
      if (err && err.status === backConstant.MOBILE_PHONE_REAPET) {
        return res.send({mobilePhoneError: constant.roleValidate.MOBILE_PHONE_REPEAT});
      }
      if (err) {
        return next(err);
      }

      return res.sendStatus(constant.httpCode.CREATED);
    });
  }
}

module.exports = RoleManagementController;
