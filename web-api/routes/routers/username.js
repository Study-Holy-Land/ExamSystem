'use strict';

var express = require('express');
var router = express.Router();

var UsernameController = require('../../controllers/username-controller');
var usernameController = new UsernameController();

router.get('/', usernameController.getUsername);

module.exports = router;

