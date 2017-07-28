var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var md5 = require('js-md5');
var validate = require('validate.js');
var constraint = require('../mixin/login-constraint');
var TeacherSession = require('../models/token');
var uuid = require('node-uuid');

function TeacherLoginController() {

}

function checkLoginInfo(account, password) {
  var pass = true;
  var valObj = {};

  valObj.email = account;
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

function setCookie(res, userHash) {
  res.cookie('user', userHash, {path: '/'});
  res.status(constant.httpCode.OK).send({
    msg: '用户登录成功!'
  });
}

TeacherLoginController.prototype.login = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var captcha = req.body.captcha;

  if (captcha !== req.session.captcha) {
    res.status(constant.httpCode.FORBIDDEN).send({
      errMsg: {
        name: 'captcha',
        msg: '验证码输入有误'
      }
    });
  } else {
    if (checkLoginInfo(email, password)) {
      password = md5(password);
      apiRequest.post('teacherLogin', {email: email, password: password}, (err, resp) => {
        if (err) {
          return next(err);
        }
        if (resp.body.status === '200') {
          var userHash = uuid.v4();
          TeacherSession.findOne({email: email}, (err, user) => {
            if (err) {
              return next(err);
            }
            if (!user) {
              new TeacherSession({
                email: email,
                userHash: userHash
              }).save((err, data) => {
                if (err) {
                  return next(err);
                }
                setCookie(res, userHash);
              });
            } else {
              TeacherSession.update({email: email}, {$set: {userHash: userHash}}, (err, obj) => {
                if (err) {
                  return next(err);
                }
                setCookie(res, userHash);
              });
            }
          });
        } else {
          res.status(401).send({
            errMsg: resp.body.errMsg
          });
        }
      });
    } else {
      res.status(constant.httpCode.UNAUTHORIZED).send({msg: '格式不正确'});
    }
  }
};

module.exports = TeacherLoginController;
