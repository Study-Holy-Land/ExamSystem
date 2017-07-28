'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/:fileName', function(req, res) {
  const filename = 'answer.zip';
  res.setHeader('Content-disposition', 'attachment; filename=' + filename + '');
  res.setHeader('Content-Type', 'application/zip');
  res.sendFile(path.join(__dirname, '../../homework-answer', req.params.fileName));
});

module.exports = router;
