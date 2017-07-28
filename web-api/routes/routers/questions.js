const express = require('express');
const router = express.Router();
const QuestionController = require('../../controllers/question-controller');
const questionController = new QuestionController();

router.get('/:questionId', questionController.getQuestion);
router.get('/getAnswer/:questionId', questionController.getAnswer);

module.exports = router;

