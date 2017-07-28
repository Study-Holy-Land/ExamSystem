class OperateHandle {
  handle(msgObj, callback) {
    if (!this.check(msgObj)) {
      return callback(null, msgObj);
    }
    this.subHandle(msgObj, callback);
  }
}

module.exports = OperateHandle;
