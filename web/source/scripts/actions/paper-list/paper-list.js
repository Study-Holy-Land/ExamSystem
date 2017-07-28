'use strict';

var Reflux = require('reflux');

var PaperListAction = Reflux.createActions([
  'loadPapers',
  'getOnePaper'
]);

module.exports = PaperListAction;
