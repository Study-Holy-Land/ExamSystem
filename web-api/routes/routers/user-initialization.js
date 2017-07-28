'use strict';

var express = require('express');
var router = express.Router();

var UserInitializationController = require('../../controllers/user-initialization-controller');
var userInitializationController = new UserInitializationController();

router.get('/initializeQuizzes/:programId/:paperId', userInitializationController.initializeQuizzes);

module.exports = router;
