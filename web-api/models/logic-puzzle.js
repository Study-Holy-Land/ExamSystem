'use strict';

var mongoose = require('mongoose');
var constant = require('../mixin/constant');
var config = require('config');

var _timeBase = 90;
var Schema = mongoose.Schema;

var logicPuzzleSchema = new Schema({
  userId: Number,
  programId: Number,
  quizItems: [{
    id: Number,
    question: String,
    description: String,
    chartPath: String,
    initializedBox: String,
    userAnswer: String
  }],
  quizExamples: [{
    id: Number,
    question: String,
    answer: String,
    description: String,
    chartPath: String,
    initializedBox: String
  }],
  sections: [{
    sectionId: Number,
    startTime: Number,
    endTime: Number
  }],
  blankQuizId: Number,
  paperId: Number,
  isCommited: Boolean
});

logicPuzzleSchema.statics.isPaperCommited = function(id, allData, index, callback) {
  var isPaperCommited;
  this.findOne({_id: id}, (err, logicPuzzle) => {
    if (err || !logicPuzzle) {
      isPaperCommited = false;
    } else {
      var TOTAL_TIME = _timeBase * constant.time.MINUTE_PER_HOUR;

      var startTime = logicPuzzle.startTime || Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
      var now = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;

      var usedTime = now - startTime;

      isPaperCommited = logicPuzzle.isCommited || parseInt(TOTAL_TIME - usedTime) <= 0;

      getData(index, allData, isPaperCommited);
      callback(null);
    }
  });
};

logicPuzzleSchema.getModuleName = function() {
  return 'logicQuizzes';
};

logicPuzzleSchema.statics.getLogicPuzzle = (orderId, userId, id) => {
  var userAnswer;
  var itemsCount;

  var model = mongoose.model('LogicPuzzles');
  return model.findOne({userId: userId, _id: id})
    .then(function(data) {
      data.quizExamples.forEach(function(example) {
        example.isExample = true;
      });
      data.quizItems.forEach(function(item) {
        item.isExample = false;
      });
      var quizAll = data.quizExamples.concat(data.quizItems);
      itemsCount = quizAll.length;
      return quizAll;
    })
    .then(function(quizAll) {
      userAnswer = quizAll[orderId].userAnswer || quizAll[orderId].answer || null;
      return {
        item: {
          id: quizAll[orderId].id,
          initializedBox: JSON.parse(quizAll[orderId].initializedBox),
          question: quizAll[orderId].question,
          description: JSON.parse(quizAll[orderId].description),
          chartPath: config.get('staticFileServer') + quizAll[orderId].chartPath
        },
        userAnswer: userAnswer,
        itemsCount: itemsCount,
        isExample: quizAll[orderId].isExample
      };
    });
};

logicPuzzleSchema.statics.isDealAgree = function(userId, callback) {
  var isDealAgree;

  this.findOne({userId: userId}, (err, logicPuzzle) => {
    if (err || !logicPuzzle || !logicPuzzle.isAgreed) {
      isDealAgree = false;
    } else {
      isDealAgree = logicPuzzle.isAgreed;
    }
    callback(isDealAgree);
  });
};

function getData(index, allData, isPaperCommited) {
  if (index < 1) {
    allData[index].status = !isPaperCommited;
  } else {
    allData[index].status = isPaperCommited && allData[index - 1].status || !isPaperCommited && !allData[index - 1].status;
  }
}

module.exports = mongoose.model('LogicPuzzles', logicPuzzleSchema);
