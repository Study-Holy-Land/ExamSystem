const express = require('express');
const multer = require('multer');
const router = express.Router();

const QuizController = require('../../controllers/quiz-controller');
const quizCtrl = new QuizController();

const storage = multer.diskStorage({
  destination: './homework-script',
  filename: function(req, file, cb) {
    cb(null, new Date().getTime() + Math.random().toString().slice(2, 8));
  }
});

const upload = multer({storage: storage});

router.post('/:quizId/submission', quizCtrl.saveAnswer);
router.post('/section/:sectionId/submission', quizCtrl.submitSection);
router.post('/scoring', quizCtrl.createScoring);
router.put('/scoring/:historyId', upload.fields([{name: 'result', maxCount: 1}]), quizCtrl.updateScoring);
router.get('/:quizId', quizCtrl.getQuiz);
router.get('/:quizId/paperInfo', quizCtrl.getPaperInfo);
router.get('/:quizId/sections', quizCtrl.getSection);
router.get('/:quizId/sections/:sectionId', quizCtrl.getOneSection);
router.get('/:quizId/quizzes', quizCtrl.getQuizzesOfSection);
module.exports = router;
