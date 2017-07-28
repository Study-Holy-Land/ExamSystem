'use strict';

var Reflux = require('reflux');
var LoginActions = require('../../actions/register-page/login-actions');
var request = require('superagent');
var constant = require('../../../../mixin/constant');
var page = require('page');
var errorHandler = require('../../../../tools/error-handler.jsx');

var LoginStore = Reflux.createStore({
  listenables: LoginActions,

  judgeLogin: function (req) {
    var data = JSON.parse(req.text);
    if (data.status === constant.httpCode.OK) {
      this.trigger({
        loginFailed: false
      });
      if (data.isSuperAdmin) {
        page('admin.html');
      } else if (data.isFinishedDetail) {
        page('paper-list.html');
      } else {
        page('user-center.html#userDetail');
      }
    } else if (data.status === constant.httpCode.FORBIDDEN) {
      this.trigger({
        clickable: false,
        captchaError: '验证码输入错误'
      });
    } else {
      this.trigger({
        clickable: false,
        loginFailed: true
      });
    }
  },

  onLogin: function (phoneEmail, loginPassword, captcha, identify) {
    request.post(API_PREFIX + 'login')
      .set('Content-Type', 'application/json')
      .send({
        account: phoneEmail,
        password: loginPassword,
        captcha: captcha,
        identify
      })
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }

        this.judgeLogin(res);
      });
  },

  onSetCaptchaError: function (error) {
    this.trigger({
      captchaError: error
    });
  }

});

module.exports = LoginStore;
