var mongoose = require('mongoose');
const constant = require('../mixin/constant');
const scoringService = require('../services/homework/scoring-service');
const QuizService = require('../services/quiz-service');
const quizService = new QuizService();

function QuizController() {
};

QuizController.prototype.getQuiz = (req, res, next) => {
  const quizId = req.params.quizId;
  var id = mongoose.Types.ObjectId(quizId);
  quizService.operate(id, (err, data) => {
    if (err) {
      return next(err);
    }
    res.status(constant.httpCode.OK).send(data);
  });
};

QuizController.prototype.getPaperInfo = (req, res, next) => {
  const quizId = req.params.quizId;
  const userId = req.session.user.id;

  quizService.getPaperInfo({quizId, userId}, (err, data) => {
    if (err && err.status === constant.httpCode.NOT_FOUND) {
      return res.sendStatus(constant.httpCode.NOT_FOUND);
    }
    if (err) {
      return next(err);
    }
    res.status(constant.httpCode.OK).send(data);
  });
};

QuizController.prototype.getSection = (req, res, next) => {
  const quizId = req.params.quizId;
  const userId = req.session.user.id;
  quizService.getSection({quizId, userId}, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.status(constant.httpCode.OK).send(data);
  });
};

QuizController.prototype.getOneSection = (req, res, next) => {
  const quizId = req.params.quizId;
  const sectionId = req.params.sectionId;
  const userId = req.session.user.id;
  quizService.getOneSection({quizId, sectionId, userId}, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.status(constant.httpCode.OK).send(data);
  });
};

QuizController.prototype.getQuizzesOfSection = (req, res, next) => {
  const quizId = req.params.quizId;
  const userId = req.session.user.id;
  quizService.getQuizzesOfSection({quizId, userId}, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.status(constant.httpCode.OK).send(data);
  });
};

QuizController.prototype.saveAnswer = (req, res, next) => {
  const options = {userAnswer: req.body.userAnswer, quizId: req.params.quizId};
  quizService.saveAnswer(options, (err, doc) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(constant.httpCode.OK);
  });
};

QuizController.prototype.submitSection = (req, res, next) => {
  let options;
  let submitFunc;
  if (req.query.type === 'BasicQuiz') {
    options = {id: req.params.sectionId, quizzes: req.body};
    submitFunc = quizService.submitBasicQuizSection;
  } else {
    options = {sectionId: req.params.sectionId, id: mongoose.Types.ObjectId(req.params.sectionId)};
    submitFunc = quizService.submitLogicPuzzleSection;
  }
  submitFunc(options, (err, doc) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(constant.httpCode.CREATED);
  });
};

QuizController.prototype.createScoring = (req, res, next) => {
  const options = Object.assign({}, req.session, req.body);
  scoringService.createScoring(options, (err, data) => {
    if (err) {
      return next(err);
    }
    res.status(constant.httpCode.CREATED).send(data);
  });
};

QuizController.prototype.updateScoring = (req, res, next) => {
  const files = req.files;
  let updateFun;
  let options;
  if (req.body.buildNumber) {
    options = {historyId: req.params.historyId, buildNumber: req.body.buildNumber};
    updateFun = scoringService.updateScoringBuildNumber;
  } else {
    options = Object.assign({historyId: req.params.historyId}, req.body, files);
    updateFun = scoringService.updateScoring;
  }

  updateFun(options, (err, data) => {
    if (err) {
      return next(err);
    }
    res.send(data);
  });
};

module.exports = QuizController;
