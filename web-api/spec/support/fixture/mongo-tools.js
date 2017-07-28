var glob = require('glob');
var async = require('async');
var fs = require('fs');
var path = require('path');

var _cachedTestData;

var fixtureModelMap = {
  "user-homework-quizzes": require("../../../models/user-homework-quizzes"),
  "group": require("../../../models/group"),
  "channel": require("../../../models/channel"),
  "configuration": require("../../../models/configuration"),
  "logic-puzzle": require("../../../models/logic-puzzle"),
  "user-paper": require("../../../models/user-paper"),
  'homework-scoring': require('../../../models/homework-scoring'),
  'paper-draft': require('../../../models/paper-draft'),
  'paper-definition': require('../../../models/paper-definition'),
  'homework-definition': require('../../../models/homework-definition'),
  'user-paper-form': require('../../../models/user-paper-form'),
  'message': require('../../../models/messages'),
  'paper': require('../../../models/paper'),
  'paper-logic-puzzle': require('../../../models/quizItem').PaperLogicPuzzle,
  'paper-homework-quiz': require('../../../models/quizItem').PaperHomeworkQuiz,
  'paper-basic-quiz': require('../../../models/quizItem').PaperBasicQuiz,
  'program': require('../../../models/program'),
  'stack': require('../../../models/stack'),
  'homework-submit': require('../../../models/quiz-submit').HomeworkQuizSubmit,
  'logic-puzzle-submit': require('../../../models/quiz-submit').LogicPuzzleSubmit,
  'invitation-code':require('../../../models/invitation-code')
};

function cacheData(done) {
  glob(__dirname + "/*.json", {}, (err, files) => {
    async.map(files, readFileData, function (err, datas) {
      _cachedTestData = datas;
      done(null, null);
    });
  })
}

function readFileData(file, callBack) {
  fs.readFile(file, 'utf8', function (err, content) {
    callBack(err, {
      name: path.basename(file, '.json'),
      content: JSON.parse(content)
    })
  });
}

function refreshMongo(mongoData, callBack) {
  var funList = [function (done) {
    done(null, null);
  }];


  mongoData.filter((item)=> {
    return item.name !== 'teacher-session';
  }).forEach((item, key) => {
    funList.push(function (data, done) {
      var model = fixtureModelMap[this.name];
      model.remove(done);
    }.bind(item));

    funList.push(function (data, done) {
      var records = this.content;
      var model = fixtureModelMap[this.name];
      model.create(records, done);
    }.bind(item));
  });

  async.waterfall(funList, callBack);
}

function refresh(callBack) {
  if (!_cachedTestData) {
    cacheData(() => {
      refreshMongo(_cachedTestData, callBack);
    })
  } else {
    refreshMongo(_cachedTestData, callBack);
  }
}

module.exports = {
  refresh: refresh
}
