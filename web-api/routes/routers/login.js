'use strict';

var express = require('express');
var router = express.Router();
var LoginController = require('../../controllers/login-controller');
var loginController = new LoginController();

router.post('/', loginController.login);

module.exports = router;
