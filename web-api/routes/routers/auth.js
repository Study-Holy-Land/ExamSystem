'use strict';

var express = require('express');
var router = express.Router();

var AuthController = require('../../controllers/auth-controller');
var authController = new AuthController();

router.get('/github', authController.loginWithGitHub);
router.get('/github/callback', authController.gitHubCallback);

module.exports = router;
