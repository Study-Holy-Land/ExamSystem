'use strict';

var express = require('express');
var router = express.Router();

var PasswordController = require('../../controllers/password-controller');
var passwordController = new PasswordController();

router.get('/retrieve', passwordController.retrieve);
router.post('/reset', passwordController.reset);

module.exports = router;
