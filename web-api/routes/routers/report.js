'use strict';

var express = require('express');
var router = express.Router();

var ReportController = require('../../controllers/report-controller');
var reportController = new ReportController();

router.get('/paper/:paperId/scoresheet', reportController.exportPaperScoresheetCsv);
router.get('/paper/:paperId/user/:userId/homework-details', reportController.exportUserHomeworkDetailsCsv);
router.get('/paper/:paperId/user/:userId/homeworkquiz/:homeworkquizId', reportController.exportUserHomeworkQuizDetailsCsv);

module.exports = router;
