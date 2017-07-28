'use strict';

var express = require('express');
var router = express.Router();

var LogoutController = require('../../controllers/logout-controller');
var logoutController = new LogoutController();

router.get('/', logoutController.logout);

module.exports = router;
