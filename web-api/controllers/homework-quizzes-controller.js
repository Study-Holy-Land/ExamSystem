'use strict';
var HomeworkQuizzesService = require('../services/homework/homework-quizzes-service');
var homeworkQuizzesService = new HomeworkQuizzesService();

function HomeworkQuizzesController() {
};

HomeworkQuizzesController.prototype.getOneHomework = (req, res, next) => {
  var id = req.params.id;
  homeworkQuizzesService.getOneHomework({id}, (err, data) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(data);
  });
};

module.exports = HomeworkQuizzesController;
