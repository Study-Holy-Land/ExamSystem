'use strict';

var express = require('express');
var router = express.Router();

var UserController = require('../../controllers/user-controller');
var userController = new UserController();

router.get('/feedback-result', userController.getFeedback);
router.get('/programs', userController.getUserProgramIds);
module.exports = router;
