var async = require('async');
var Message = require('../../models/messages');
var OperateHandler = require('./OperateHandler');

class ToggleToReadHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'read' || msgObj.state === 0);
  }

  subHandle(msgObj, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': msgObj._id}, {state: 1}, () => {
          done(null, null);
        });
      }], callback);
  }
}

module.exports = ToggleToReadHandler;
