var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var homeworkScoring = require('./homework-scoring'); // eslint-disable-line
var quizSubmitSchema = new Schema({
});

var QuizSubmit = mongoose.model('QuizSubmit', quizSubmitSchema);

var HomeworkQuizSubmit = QuizSubmit.discriminator('homework', new Schema({
  homeworkScoringId: {
    type: String,
    ref: 'homeworkScoring'
  }
}));

var LogicPuzzleSubmit = QuizSubmit.discriminator('logicPuzzle', new Schema({
  userAnswer: Number
}));

var BasicQuizSubmit = QuizSubmit.discriminator('basicQuiz', new Schema({
  userAnswer: String
}));

module.exports = {QuizSubmit, HomeworkQuizSubmit, LogicPuzzleSubmit, BasicQuizSubmit};
