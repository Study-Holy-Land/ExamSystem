'use strict';

var superAgent = require('superagent');

function baseApiRequest(apiServer) {
  var method = {
    get: function(url, query, callback) {
      if (typeof query === 'function') {
        callback = query;
        query = {};
      }

      superAgent.get(apiServer + url)
        .set('Content-Type', 'application/json')
        .query(query)
        .end(callback);
    },

    post: function(url, body, callback) {
      superAgent.post(apiServer + url)
        .set('Content-Type', 'application/json')
        .send(body)
        .end(callback);
    },

    put: function(url, data, callback) {
      superAgent.put(apiServer + url)
        .set('Content-Type', 'application/json')
        .send(data)
        .end(callback);
    }
  };
  return method;
}

module.exports = baseApiRequest;
