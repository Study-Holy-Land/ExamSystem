'use strict';

var express = require('express');
var router = express.Router();
var PaperDraftController = require('../../controllers/paper-draft-controller');
var paperDraftController = new PaperDraftController();

router.get('/', paperDraftController.getPaperDraft);

router.post('/', paperDraftController.createPaperDraft);

router.post('/:paperHash/logicPuzzleSections', paperDraftController.insertLogicPuzzleSections);

router.post('/:paperHash/homeworkSections', paperDraftController.insertHomeworkSections);

module.exports = router;
