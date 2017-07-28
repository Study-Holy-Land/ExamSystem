'use strict';

var express = require('express');
var router = express.Router();
var PaperController = require('../../controllers/paper-controller');

router.get('/:paperHash', PaperController.details);
router.get('/:paperId/obtainment', PaperController.obtain);
router.get('/', PaperController.getLists);
router.post('/createPaper', PaperController.createPaper);
router.put('/modifiedPaper/:paperId', PaperController.modifyPaperMeta);
router.delete('/:id', PaperController.deletePaper);

module.exports = router;
