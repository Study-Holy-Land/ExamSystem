var async = require('async');
var Message = require('../../models/messages');
var AgreementRequestAnswerHandler = require('./AgreementRequestAnswerHandler');
var DisagreementRequestAnswerHandler = require('./DisagreementRequestAnswerHandler');
var ToggleToReadHandler = require('./ToggleToReadHandler');
var DisagreementInvitationHandler = require('./DisagreementInvitationHandler');
var AgreementInvitationHandler = require('./AgreementInvitationHandler');

class MessageService {
  constructor() {
    this.toggleToReadHandler = new ToggleToReadHandler();
    this.agreementRequestAnswerHandler = new AgreementRequestAnswerHandler();
    this.disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
    this.disagreementInvitationHandler = new DisagreementInvitationHandler();
    this.agreementInvitationHandler = new AgreementInvitationHandler();
  }

  operate({messageId, operation}, callback) {
    let msgObj;
    async.waterfall([
      (done) => {
        Message.findById(messageId, (err, doc) => {
          msgObj = Object.assign({}, doc.toJSON(), {operation});
          done(err, msgObj);
        });
      },
      (data, done) => {
        this.toggleToReadHandler.handle(msgObj, done);
      },
      (data, done) => {
        this.disagreementRequestAnswerHandler.handle(msgObj, done);
      },
      (data, done) => {
        this.agreementRequestAnswerHandler.handle(msgObj, done);
      },
      (data, done) => {
        this.agreementInvitationHandler.handle(msgObj, done);
      },
      (data, done) => {
        this.disagreementInvitationHandler.handle(msgObj, done);
      }
    ], callback);
  }
}

module.exports = MessageService;
