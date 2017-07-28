'use strict';

var Reflux = require('reflux');
var PaperAssignmentAction = require('../../actions/paper-assignment/paper-assignment-actions');
var request = require('superagent');
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');

var PaperAssignmentStore = Reflux.createStore({
  listenables: [PaperAssignmentAction],

  onAddLink: function (link, links) {
    request.post(API_PREFIX + 'paper-assignment')
      .set('Content-Type', 'application/json')
      .send(link)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        if (!res.body) {
          links.push(link);
          this.trigger({links: links});
        }
      });
  },

  onGetLinks: function () {
    request.get(API_PREFIX + 'paper-assignment')
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        this.trigger({links: res.body.links});
      });
  },

  onDeleteLink: function (link, links, deleteIndex) {
    request.del(API_PREFIX + 'paper-assignment')
      .set('Content-Type', 'application/json')
      .query(link)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        if (res.status === constant.httpCode.OK) {
          links[deleteIndex].delete = true;
          this.trigger({links: links});
        }
      });
  },

  onGetPaperName: function () {
    request.get(API_PREFIX + 'paper-assignment/papers')
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        this.trigger({papers: res.body.papers});
      });
  }
});

module.exports = PaperAssignmentStore;
