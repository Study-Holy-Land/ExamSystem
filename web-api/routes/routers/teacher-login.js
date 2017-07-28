var express = require('express');
var router = express.Router();
var TeacherLoginController = require('../../controllers/teacher-login-controller');
var teacherLoginController = new TeacherLoginController();

router.post('/', teacherLoginController.login);
module.exports = router;
