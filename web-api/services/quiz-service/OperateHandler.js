class OperateHandler {
  handle(quiz, callback) {
    if (!this.check(quiz)) {
      return callback(null, quiz);
    }
    this.subHandle(quiz, callback);
  }
}

module.exports = OperateHandler;
