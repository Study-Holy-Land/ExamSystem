var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizItemSchema = new Schema({});

quizItemSchema.statics.findOrCreateLogic = (condition, data, done) => {
  const model = mongoose.model('QuizItem');
  if (typeof data === 'function') {
    done = data;
    data = condition;
  }
  condition.__t = 'LogicPuzzle';
  model.findOne(condition, (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
      return done(null, doc);
    }
    var LogicPuzzle = new PaperLogicPuzzle(data);
    LogicPuzzle.save(done);
  });
};

quizItemSchema.statics.findOrCreateHomework = (condition, data, done) => {
  const model = mongoose.model('QuizItem');
  if (typeof data === 'function') {
    done = data;
    data = condition;
  }
  condition.__t = 'HomeworkQuiz';
  model.findOne(condition, (err, doc) => {
    if (err) {
      done(err, null);
    }
    if (doc) {
      return done(null, doc);
    }
    // model.create(data, done);
    var HomeworkQuiz = new PaperHomeworkQuiz(data);
    HomeworkQuiz.save(done);
  });
};

quizItemSchema.statics.findOrCreateBasic = (condition, data, done) => {
  const model = mongoose.model('QuizItem');
  if (typeof data === 'function') {
    done = data;
    data = condition;
  }
  condition.__t = 'BasicQuiz';
  model.findOne(condition, (err, doc) => {
    if (err) {
      done(err, null);
    }
    if (doc) {
      return done(null, doc);
    }
    var BasicQuiz = new PaperBasicQuiz(data);
    BasicQuiz.save(done);
  });
};

var QuizItem = mongoose.model('QuizItem', quizItemSchema);

var PaperLogicPuzzle = QuizItem.discriminator('LogicPuzzle', new Schema({
  question: String,
  description: String,
  id: Number,
  chartPath: String,
  initializedBox: String,
  answer: String
}));

var PaperHomeworkQuiz = QuizItem.discriminator('HomeworkQuiz', new Schema({
  homeworkName: String,
  evaluateScript: String,
  templateRepository: String,
  createTime: Number,
  description: String,
  id: Number,
  type: String,
  uri: String,
  answerPath: String
}));

var PaperBasicQuiz = QuizItem.discriminator('BasicQuiz', new Schema({
  id: Number,
  description: String,
  type: String,
  answer: String,
  options: []
}));

module.exports = {QuizItem, PaperLogicPuzzle, PaperHomeworkQuiz, PaperBasicQuiz};
