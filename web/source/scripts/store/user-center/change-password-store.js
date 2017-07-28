'use strict';

var Reflux = require('reflux');
var ChangePasswordActions = require('../../actions/user-center/change-password-actions');
var GetAccountActions = require('../../actions/reuse/get-account-actions');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');
var constant = require('../../../../mixin/constant');
var lang = require('../../../../mixin/lang-message/chinese');

var ChangePasswordStore = Reflux.createStore({
  listenables: [ChangePasswordActions, GetAccountActions],

  onChangePassword: function (passwordInfo) {
    this.trigger({isRespond: true});
    request.put(API_PREFIX + 'user-detail/change-password')
      .set('Content-Type', 'application/json')
      .send({
        data: passwordInfo
      })
      .use(errorHandler)
      .end((err, res) => {
        if (err && err.status === constant.httpCode.BAD_REQUEST) {
          this.trigger({
            isRespond: false,
            oldPasswordError: lang.ERROR
          });
        } else if (err) {
          return;
        }
        if (!res) {
          return;
        }
        if (res.body.status === constant.httpCode.OK) {
          this.trigger({
            success: true,
            isRespond: false
          }, () => {
            GetAccountActions.logout();
          });
        }
      });
  }
});

module.exports = ChangePasswordStore;
