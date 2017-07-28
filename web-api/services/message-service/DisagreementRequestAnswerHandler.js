var async = require('async');
var Message = require('../../models/messages');
var OperateHandler = require('./OperateHandler');

class DisagreementRequestAnswerHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'disagreement' && msgObj.type === 'REQUEST_ANSWER');
  }

  subHandle(msgObj, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': msgObj._id}, {state: 1}, done);
      },
      (data, done) => {
        Message.findById(msgObj._id, done);
      },
      (data, done) => {
        let newData = {
          deeplink: data.deeplink,
          from: data.to,
          to: data.from,
          type: 'DISAGREE_REQUEST_ANSWER',
          state: 0
        };
        new Message(newData).save(done);
      }
    ], (err, data) => {
      callback(err, data);
    });
  }
}

module.exports = DisagreementRequestAnswerHandler;
