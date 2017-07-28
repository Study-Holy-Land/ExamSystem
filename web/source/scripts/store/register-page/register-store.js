'use strict';

var Reflux = require('reflux');
var RegisterActions = require('../../actions/register-page/register-actions');
var page = require('page');
var request = require('superagent');
var constant = require('../../../../mixin/constant');
var async = require('async');
var errorHandler = require('../../../../tools/error-handler.jsx');

var RegisterStore = Reflux.createStore({
  listenables: RegisterActions,
  onCheckEmail: function (value, done) {
    return request
        .get(API_PREFIX + 'register/validate-email')
        .set('Content-Type', 'application/json')
        .query({
          email: value
        })
        .use(errorHandler)
        .end((err, req) => {
          if (err) {
            return;
          }
          var error = '';
          if (req.body.status === constant.httpCode.OK) {
            error = '该邮箱已被注册';
          }
          done({emailError: error});
        });
  },

  onCheckMobilePhone: function (value, done) {
    return request
        .get(API_PREFIX + 'register/validate-mobile-phone')
        .set('Content-Type', 'application/json')
        .query({
          mobilePhone: value
        })
        .use(errorHandler)
        .end((err, req) => {
          if (err) {
            return;
          }
          var error = '';
          if (req.body.status === constant.httpCode.OK) {
            error = '该手机号已被注册';
          }
          done({mobilePhoneError: error});
        });
  },

  triggerInfo: function (info) {
    var emailExist = info.data.isEmailExist ? '该邮箱已被注册' : '';
    var mobilePhoneExist = info.data.isMobilePhoneExist ? '该手机号已被注册' : '';
    var captchaError = info.data.isCaptchaError ? '验证码错误' : '';

    this.trigger({
      mobilePhoneError: mobilePhoneExist,
      emailError: emailExist,
      captchaError: captchaError,
      clickable: false
    });
  },

  getPageUrl (info, invitationCode) {
    let pageUrl = 'user-center.html#userDetail';
    const addProgramStatus = info.programErrMessage.status;
    if (addProgramStatus === constant.httpCode.CREATED) {
      pageUrl += '?addProgram=1';
    } else if (addProgramStatus === constant.httpCode.NOT_FOUND) {
      pageUrl += invitationCode === '' ? '?addProgram=0' : '?addProgram=2';
    } else {
      pageUrl += '?addProgram=3';
    }
    return pageUrl;
  },

  getRegisterErr (info) {
    const emailExist = info.data.isEmailExist ? '该邮箱已被注册' : '';
    const mobilePhoneExist = info.data.isMobilePhoneExist ? '该手机号已被注册' : '';
    const captchaError = info.data.isCaptchaError ? '验证码错误' : '';
    return {
      mobilePhoneError: mobilePhoneExist,
      emailError: emailExist,
      captchaError: captchaError,
      clickable: false
    };
  },

  onRegister: function (userName, mobilePhone, email, password, invitationCode, captcha) {
    let registerInfo = {
      userName: userName,
      mobilePhone: mobilePhone,
      email: email,
      password: password,
      captcha: captcha

    };
    let programInfo = {};
    if (invitationCode.length === 8) {
      programInfo.programCode = invitationCode;
    } else if (invitationCode.length === 12) {
      programInfo.invitationCode = invitationCode;
    }
    let data = Object.assign({}, {registerInfo}, programInfo);
    request
        .post(API_PREFIX + 'register')
        .set('Content-Type', 'application/json')
        .send(data)
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            throw (err);
          }
          const info = res.body;
          if (info.status === constant.httpCode.OK) {
            const pageUrl = this.getPageUrl(info, invitationCode);
            page(pageUrl);
          } else if (info.status === constant.httpCode.FORBIDDEN) {
            this.trigger({
              isDisabled: info.registerable
            });
          } else {
            const errMessage = this.getRegisterErr();
            this.trigger(errMessage);
          }
        });
  },

  onInitialUserQuiz: function () {
    async.series({
      initializeQuizzes: (done) => {
        request.get(API_PREFIX + 'user-initialization/initializeQuizzes')
            .set('Content-Type', 'application/json')
            .use(errorHandler)
            .end(function (err) {
              if (err) {
                done(err);
              } else {
                done(null, true);
              }
            });
      }
    }, function (err, data) {
      if (err) {
        return;
      }
      if (data.initializeQuizzes) {
        page('user-center.html#userDetail');
      }
    });
  },

  onChangeState: function (isShowToggle) {
    this.trigger({
      isShowToggle: !isShowToggle
    });
  },

  onInputPassword: function (password) {
    this.trigger({
      password: password
    });
  },

  onInputCaptcha: function (captcha) {
    this.trigger(captcha);
  },

  onCheckData: function (stateObj) {
    this.trigger(stateObj);
  },

  onRegisterable: function () {
    request.get(API_PREFIX + 'register/registerable')
        .set('Content-Type', 'application/json')
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            return;
          }
          if (!res.body) {
            return;
          } else if (res.status === constant.httpCode.OK) {
            this.trigger({
              isDisabled: !res.body.registerable
            });
          }
        });
  }
});

module.exports = RegisterStore;
