var express = require('express');
var router = express.Router();

var ReportsController = require('../../controllers/reports-controller');
var reportsCtrl = new ReportsController();

router.get('/:type', reportsCtrl.exportCSV);
router.get('/:type/:menteeId', reportsCtrl.exportMenteeQuizCSV);

module.exports = router;
