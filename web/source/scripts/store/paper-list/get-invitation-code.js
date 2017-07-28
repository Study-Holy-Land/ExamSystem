'use strict';

var Reflux = require('reflux');
var getInvitationCodeActions = require('../../actions/paper-list/get-invitation-code-actions');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');

var getInvitationCodeStore = Reflux.createStore({
  listenables: getInvitationCodeActions,

  onGetInvitationCode: function (email) {
    request.get(API_PREFIX + '/programs')
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          const programs = res.body.programList;
          let usefulPrograms = [];
          programs.forEach((program) => {
            if (program.codeEnable) {
              usefulPrograms.push(program);
            }
          });

          request.post(API_PREFIX + 'email')
            .set('Content-Type', 'application/json')
            .send({
              programs: usefulPrograms,
              userEmail: email,
              title: '思特沃克学院-获取邀请码'
            })
            .use(errorHandler)
            .end((err, res) => {
              if (err) {
                return;
              }
              if (!res) {
                return;
              }
              if (res.body.status === 200) {
                this.trigger({
                  getInvitationCodeFailed: false,
                  showMessage: true
                });
              } else {
                this.trigger({
                  clickable: false,
                  getInvitationCodeFailed: true,
                  showMessage: false
                });
              }
            });
        }
      });
  }

});

module.exports = getInvitationCodeStore;
