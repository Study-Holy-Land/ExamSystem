'use strict';

var Reflux = require('reflux');
var GetAccountActions = require('../../actions/reuse/get-account-actions');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');
var constant = require('../../../../mixin/constant');
var page = require('page');

var GetAccountStore = Reflux.createStore({
  listenables: [GetAccountActions],

  onLoadAccount: function () {
    request.get(API_PREFIX + 'reuse/account')
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        } else if (res.body.status === constant.httpCode.OK) {
          this.trigger({
            account: res.body.account,
            userName: res.body.userName,
            isSuperAdmin: res.body.superAdmin,
            isMentor: res.body.mentor,
            isLoged: true
          });
        } else if (res.body.status === constant.httpCode.ACCEPTED) {
          this.trigger({account: '', isLoged: false});
        } else {
          return;
        }
      });
  },
  onLogout: function () {
    request.get(API_PREFIX + 'logout')
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        page('register.html');
      });
  }
});

module.exports = GetAccountStore;
