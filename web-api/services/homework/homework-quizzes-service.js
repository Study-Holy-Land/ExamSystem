var apiRequest = require('../api-request');
var async = require('async');

class HomeworkQuizzesService {
  getOneHomework({id}, callback) {
    async.waterfall([
      (done) => {
        apiRequest.get('homeworkQuizzes/' + id, (err, res) => {
          done(err, res.body);
        });
      },
      (data, done) => {
        apiRequest.get(data.makerDetailUri, (err, resp) => {
          const makerName = resp.body.name;
          const homeworkQuiz = Object.assign({}, data, {makerName});
          done(err, homeworkQuiz);
        });
      }
    ], (err, data) => {
      callback(err, data);
    });
  }
}

module.exports = HomeworkQuizzesService;
