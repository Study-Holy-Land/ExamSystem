'use strict';

var express = require('express');
var router = express.Router();
var RegisterController = require('../../controllers/register-controller');
var registerController = new RegisterController();

router.post('/', registerController.register);

router.get('/validate-mobile-phone', registerController.valdateMobilePhone);

router.get('/validate-email', registerController.valdateEmail);

router.get('/registerable', registerController.registerable);

module.exports = router;
