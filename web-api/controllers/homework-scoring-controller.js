var async = require('async');
var fs = require('fs');
var request = require('superagent');
var userHomeworkScoring = require('../models/homework-scoring');
const config = require('config');
var taskApi = config.get('taskApi');

var homeworkScoringController = {
  getScoring: (req, res, next) => {
    // fixme : find 函数内需要参数
    userHomeworkScoring.find()
      .exec((err, data) => {
        if (err) {
          return next(err);
        }
        res.send(data);
      });
  },

  createScoring: (req, res, next) => {
    async.waterfall([

      (done) => {
        var data = Object.assign({}, req.body, {userId: req.session.user.id});
        userHomeworkScoring.create(data, done);
      },

      (data, done) => {
        fs.readFile('/Users/wjlin/Downloads/test.sh', 'utf8', done);
      },

      (data, done) => {
        var script = data.split('\n').join('\\n');

        request
          .post(taskApi)
          .type('form')
          .send({
            script: script
          })
          .end(done);
      }

    ], (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(201).send(data);
    });
  },

  updateScoring: (req, res, next) => {
    async.waterfall([
      (done) => {
        userHomeworkScoring.update(req.params.id, req.body, done);
      },

      (data, done) => {
        done(null, null);
      }
    ], (err, data) => {
      if (err) {
        return next(err);
      }
      res.send(data);
    });
  }
};

module.exports = homeworkScoringController;
