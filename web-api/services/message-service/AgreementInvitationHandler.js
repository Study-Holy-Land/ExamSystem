var async = require('async');
var Message = require('../../models/messages');
var OperateHandler = require('./OperateHandler');
var apiRequest = require('../api-request');

class AgreementInvitationHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'agreement' && msgObj.type === 'INVITATION');
  };

  subHandle(msgObj, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': msgObj._id}, {state: 1}, () => {
          done(null, null);
        });
      },
      (data, done) => {
        Message.findById(msgObj._id, done);
      },
      (data, done) => {
        const from = data.from;
        const to = data.to;
        apiRequest.post(`relationshipCreating/${to}/students/${from}`, {}, (err, resp) => {
          if (err) {
            return done(err, null);
          }
        });
        let newMessage = {
          from: data.to,
          to: data.from,
          deeplink: data.deeplink,
          type: 'AGREE_INVITATION',
          state: 0
        };
        done(null, newMessage);
      },
      (data, done) => {
        new Message(data).save(done);
      }
    ], (err, data) => {
      callback(err, data);
    });
  }
}

module.exports = AgreementInvitationHandler;
