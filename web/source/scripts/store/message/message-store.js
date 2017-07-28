/*eslint no-magic-numbers: 0*/

var Reflux = require('reflux');
var superAgent = require('superagent');
var MessageActions = require('../../actions/messages/message-actions');
var errorHandler = require('../../../../tools/error-handler.jsx');

var requestAnswerStore = Reflux.createStore({
  listenables: [MessageActions],

  onCreateMessage: function (data) {
    superAgent
      .post(API_PREFIX + 'messages')
      .use(errorHandler)
      .send(data)
      .end((err, res) => {
        if (err) {
          return;
        }
      });
  }
});

module.exports = requestAnswerStore;
