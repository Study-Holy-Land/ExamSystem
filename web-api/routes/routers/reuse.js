'use strict';

var express = require('express');
var router = express.Router();

var ReuseController = require('../../controllers/reuse-controller');
var reuseController = new ReuseController();

router.get('/account', reuseController.loadAccount);

module.exports = router;
