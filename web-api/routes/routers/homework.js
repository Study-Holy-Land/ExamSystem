'use strict';

var express = require('express');
var multer = require('multer');
var router = express.Router();

var HomeworkController = require('../../controllers/homework-controller');
var homeworkController = new HomeworkController();
var githubReq = require('../../services/github-req.js');

var storage = multer.diskStorage({
  destination: './homework-script',
  filename: function(req, file, cb) {
    cb(null, new Date().getTime() + Math.random().toString().slice(2, 8));
  }
});

var upload = multer({storage: storage});

router.get('/get-list/:id', homeworkController.getList);
router.get('/quiz', homeworkController.getOneQuiz);
router.get('/get-branches', githubReq.getBranches);
router.put('/status/:historyId', homeworkController.updateStatus);
router.get('/estimated-time', homeworkController.getEstimatedTime);
router.post('/save', homeworkController.saveGithubUrl);

// router.get('/scoring', homeworkScoringController.getScoring);
router.get('/quizzes/:quizId', homeworkController.getQuiz);

router.put('/scoring/:historyId', upload.fields([{name: 'result', maxCount: 1}]), homeworkController.updateScoring);
router.post('/scoring', homeworkController.createScoring);

module.exports = router;
