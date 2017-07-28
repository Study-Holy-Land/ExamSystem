'use strict';

var baseApiRequest = require('./base-api-request.js');
const config = require('config');

var apiRequest = baseApiRequest(config.get('userApiServer'));

module.exports = apiRequest;
