'use strict';

var Reflux = require('reflux');
var passwordRetrieveActions = require('../../actions/password-retrieve/password-retrieve-actions');
var request = require('superagent');
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');

var passwordRetrieveStore = Reflux.createStore({
  listenables: passwordRetrieveActions,

  onRetrieve: function (email) {
    const role = window.location.search.split('=')[1];
    request.get(API_PREFIX + 'password/retrieve')
      .set('Content-Type', 'application/json')
      .query({
        email: email,
        role
      })
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        if (!res) {
          return;
        }
        if (res.body.status === constant.httpCode.OK) {
          this.trigger({
            retrieveFailed: false,
            showMessage: true
          });
        } else if (res.body.status === constant.httpCode.NOT_FOUND) {
          this.trigger({
            clickable: false,
            retrieveFailed: true,
            showMessage: false
          });
        }
      });
  }

});

module.exports = passwordRetrieveStore;
