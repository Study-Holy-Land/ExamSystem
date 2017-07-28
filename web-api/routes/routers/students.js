var express = require('express');
var router = express.Router();

var StudentController = require('../../controllers/student-controller');
var studentCtrl = new StudentController();

router.get('/', studentCtrl.getMentees);

module.exports = router;
