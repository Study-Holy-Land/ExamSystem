'use strict';

var express = require('express');
var router = express.Router();
var EmailController = require('../../controllers/email-controller');
var emailController = new EmailController();

router.post('/', emailController.sendEmail);

module.exports = router;
