'use strict';

var Reflux = require('reflux');

var ChannelAction = Reflux.createActions([
  'addLink',
  'getLinks',
  'deleteLink'
]);

module.exports = ChannelAction;
