var logicPuzzles = require('../../models/logic-puzzle');
var homeworkQuizzes = require('../../models/user-homework-quizzes');
var HomeworkQuiz = require('./homework-quiz-section');
var LogicPuzzle = require('./logic-puzzle-section');
var Rx = require('rx');

const classMap = {
  'LogicPuzzle': LogicPuzzle,
  'UserHomeworkQuizzes': HomeworkQuiz
};

class SectionService {
  getList(condition, done) {
    let logicPuzzleFind = Rx.Observable.fromPromise(logicPuzzles.find(condition));
    let homeworkQuizzesFind = Rx.Observable.fromPromise(homeworkQuizzes.find(condition));

    Rx.Observable.concat(logicPuzzleFind, homeworkQuizzesFind)
      .flatMap((x) => {
        return Rx.Observable.from(x);
      })
      .map((x) => {
        let type = x.constructor.modelName;
        return new classMap[type](x);
      })
      .map(x => x.toJSON())
      .toArray()
      .subscribe((x) => {
        done(null, x);
      }, (x) => {
        done(x);
      }, (x) => {
      });
  }
}

module.exports = SectionService;
