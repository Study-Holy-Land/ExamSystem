var async = require('async');
var Message = require('../../models/messages');
var OperateHandler = require('./OperateHandler');

class AgreementRequestAnswerHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'agreement' && msgObj.type === 'REQUEST_ANSWER');
  }

  subHandle(msgObj, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': msgObj._id}, {state: 1}, () => {
          done(null, null);
        });
      },
      (data, done) => {
        let newMessage = {
          from: msgObj.to,
          to: msgObj.from,
          deeplink: msgObj.deeplink,
          type: 'AGREE_REQUEST_ANSWER',
          state: 0
        };
        new Message(newMessage).save(done);
      }
    ], (err, data) => {
      callback(err, data);
    });
  }
}

module.exports = AgreementRequestAnswerHandler;
