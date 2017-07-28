'use strict';

const config = require('config');
var baseApiRequest = require('./base-api-request');
var apiRequest = baseApiRequest(config.get('paperApiServer'));

module.exports = apiRequest;
