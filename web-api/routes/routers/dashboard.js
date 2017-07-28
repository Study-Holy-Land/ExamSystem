'use strict';

var express = require('express');
var router = express.Router();
var DashboardController = require('../../controllers/dashboard-controller');
var dashboardController = new DashboardController();

router.get('/:programId/:paperId', dashboardController.isCommited);

module.exports = router;
