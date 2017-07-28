var async = require('async');
var Message = require('../../models/messages');
var OperateHandler = require('./OperateHandler');

class DisagreementInvitationHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'disagreement' && msgObj.type === 'INVITATION');
  }

  subHandle(msgObj, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': msgObj._id}, {state: 1}, done);
      },
      (data, done) => {
        let newData = {
          from: msgObj.to,
          to: msgObj.from,
          type: 'DISAGREE_INVITATION',
          state: 0
        };
        new Message(newData).save(done);
      }
    ], (err, data) => {
      callback(err, data);
    });
  }
}

module.exports = DisagreementInvitationHandler;
