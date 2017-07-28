'use strict';
var superAgent = require('superagent');
var errorHandler = require('../../../tools/error-handler.jsx');
var noCache = require('superagent-no-cache');

function baseApiRequest (apiPrefix) {
  var method = {
    get: function (url, query, callback) {
      if (typeof query === 'function') {
        callback = query;
        query = {};
      }

      superAgent.get(apiPrefix + url)
          .set('Content-Type', 'application/json')
          .use(noCache)
          .use(errorHandler)
          .query(query)
          .end(callback);
    },

    post: function (url, body, callback) {
      superAgent.post(apiPrefix + url)
          .set('Content-Type', 'application/json')
          .use(errorHandler)
          .send(body)
          .end(callback);
    },

    put: function (url, data, callback) {
      superAgent.put(apiPrefix + url)
          .set('Content-Type', 'application/json')
          .use(errorHandler)
          .send(data)
          .end(callback);
    }
  };
  return method;
}

module.exports = baseApiRequest(API_PREFIX);
