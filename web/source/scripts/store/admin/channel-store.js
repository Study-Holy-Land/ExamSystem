'use strict';

var Reflux = require('reflux');
var ChannelAction = require('../../actions/admin/channel-actions');
var request = require('superagent');
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');
var nocache = require('superagent-no-cache');

var ChannelStore = Reflux.createStore({
  listenables: ChannelAction,

  onAddLink: function (link, links) {
    request.post(API_PREFIX + 'admin/channel')
      .set('Content-Type', 'application/json')
      .send(link)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        if (!res.body) {
          this.onGetLinks();
        }
      });
  },

  onGetLinks: function () {
    request.get(API_PREFIX + 'admin/channel')
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .use(nocache)
      .end((err, res) => {
        if (err) {
          return;
        }
        this.trigger({links: res.body.links});
      });
  },

  onDeleteLink: function (link, links, deleteIndex) {
    request.del(API_PREFIX + 'admin/channel')
      .set('Content-Type', 'application/json')
      .query(link)
      .use(errorHandler)
      .use(nocache)
      .end((err, res) => {
        if (err) {
          return;
        }
        if (res.status === constant.httpCode.OK) {
          links[deleteIndex].delete = true;
          this.trigger({links: links});
        }
      });
  }

});

module.exports = ChannelStore;
