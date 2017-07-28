'use strict';
var constant = require('../mixin/constant');
var async = require('async');
var apiRequest = require('../services/api-request');
var dashboardService = require('../services/dashboard/dashboard-service');
function DashboardController() {

}

function checkDetail(userDetatil) {
  for (var member in userDetatil) {
    if (userDetatil[member] === null) {
      return false;
    }
  }
  return true;
}

DashboardController.prototype.isCommited = (req, res) => {
  var sections = JSON.parse(req.query.sections);
  var userId = req.session.user.id;
  var data = {sections};
  async.waterfall([
    (done) => {
      apiRequest.get('users/' + userId + '/detail', (err, res, next) => {
        if (err && res.statusCode !== 404) {
          return next(err);
        }
        data.isFinishedDetail = res.statusCode === 404 ? false : checkDetail(res.body);
        done(null, data);
      });
    },
    (data, done) => {
      async.eachSeries(data.sections, (item, callback) => {
        let index = data.sections.indexOf(item);
        if (item.type === 'logicQuizzes') {
          dashboardService.getLogicPuzzleStatus(item.id, data.sections, index, callback);
        }
        if (item.type === 'homeworkQuizzes') {
          dashboardService.getHomeworkQuizStatus(item.id, data.sections, index, callback);
        }
      }, (err) => {
        if (err) {
          throw err;
        } else {
          done(null, data);
        }
      });
    }
  ], (err, data) => {
    if (err) {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
    } else {
      res.send(data);
    }
  });
};

module.exports = DashboardController;
