'use strict';

var express = require('express');
var router = express.Router();

var PaperAssignmentController = require('../../controllers/paper-assignment-controller');
var paperAssignmentController = new PaperAssignmentController();

router.post('/', paperAssignmentController.addLink);
router.get('/', paperAssignmentController.getLinks);
router.delete('/', paperAssignmentController.removeLink);
router.get('/papers', paperAssignmentController.getPaperName);

module.exports = router;
