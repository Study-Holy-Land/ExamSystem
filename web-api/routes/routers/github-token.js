'use strict';

var express = require('express');
var router = express.Router();
var TokenController = require('../../controllers/github-token-controller');
var tokenController = new TokenController();

router.put('/', tokenController.updateGithubToken);
router.get('/', tokenController.getGithubToken);

module.exports = router;
