'use strict';

var Reflux = require('reflux');
var PaperDetailAction = require('../../actions/paper-detail/paper-detail');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');

var paperDetailStore = Reflux.createStore({
  listenables: [PaperDetailAction],

  onGetPaperDetail (id, programId) {
    request.get(`/programs/${programId}/papers/${id}`)
        .set('Content-Type', 'application/json')
        .use(errorHandler)
        .end((err, resp) => {
          if (err) {
            return;
          } else {
            resp.send(resp.body);
          }
        });
  }
});

module.exports = paperDetailStore;
