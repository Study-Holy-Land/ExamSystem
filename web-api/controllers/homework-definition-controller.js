'use strict';

var HomeworkDefinition = require('../models/homework-definition');
var apiRequest = require('../services/api-request');
var unique = require('../tool/unique');
var addMakerName = require('../tool/addMakerName');
var async = require('async');
var constant = require('../mixin/constant');
var HomeworkDefinitionService = require('../services/homework-definition-service/HomeworkDefinitionService');
const homeworkDefService = new HomeworkDefinitionService();

function HomeworkDefinitionController() {
}

HomeworkDefinitionController.prototype.getHomeworkList = (req, res, next) => {
  let pageCount = req.query.pageCount || 10;
  let page = req.query.page || 1;
  let order = req.query.order || '1';
  let sort = req.query.sort || 'createTime';

  homeworkDefService.getHomeworkList({pageCount, page, order, sort}, (err, data) => {
    if (err) {
      return next(err);
    }
    res.status(constant.httpCode.OK).send(data);
  });
};

HomeworkDefinitionController.prototype.matchHomework = (req, res) => {
  let pageCount = req.query.pageCount || 10;
  let page = req.query.page || 1;
  let skipCount = pageCount * (page - 1);
  let name = req.query.name;
  let homeworks;
  HomeworkDefinition.find({name, isDeleted: false}).limit(Number(pageCount))
      .skip(skipCount).exec((err, data) => {
        HomeworkDefinition.count({isDeleted: false}, (error, count) => {
          if (!err && !error && count && data) {
            let totalPage = Math.ceil(count / pageCount);
            let ids = data.map((homework) => {
              return homework.makerId;
            });
            let id = unique(ids);
            apiRequest.get('users/' + id + '/detail', (err, resp) => {
              if (!err && resp) {
                homeworks = addMakerName(resp, data);
                return res.status(constant.httpCode.OK).send({data: homeworks, totalPage});
              } else {
                res.sendStatus(constant.httpCode.NOT_FOUND);
              }
            });
          } else {
            res.sendStatus(constant.httpCode.NOT_FOUND);
          }
        });
      });
};

HomeworkDefinitionController.prototype.getOneHomework = (req, res) => {
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.findOne({_id: homeworkId, isDeleted: false}, (err, homework) => {
    if (!err && homework) {
      res.send(homework);
    } else {
      res.sendStatus(constant.httpCode.BAD_REQUEST);
    }
  });
};

HomeworkDefinitionController.prototype.deleteHomework = (req, res, next) => {
  const homeworkId = req.params.homeworkId;
  const operationInfo = {
    operatorId: req.session.user.id,
    operationType: 'DELETE'
  };

  async.waterfall([
    (done) => {
      HomeworkDefinition.findById(homeworkId, done);
    },
    (doc, done) => {
      if (!doc) {
        return done({status: 400}, null);
      }
      if (doc.uri) {
        const id = doc.uri.split('/')[1];
        apiRequest.put(`homeworkQuizzes/${id}`, operationInfo, done);
      } else {
        done(null, doc);
      }
    },
    (doc, done) => {
      if (!doc) {
        return done({status: 400}, null);
      }
      HomeworkDefinition.findByIdAndRemove(homeworkId, done);
    }
  ], (err) => {
    if (err && err.status) {
      return res.sendStatus(constant.httpCode.BAD_REQUEST);
    }
    if (err) {
      return next(err);
    }
    return res.sendStatus(constant.httpCode.NO_CONTENT);
  });
};

HomeworkDefinitionController.prototype.insertEvaluateScript = (req, res) => {
  res.send(req.file);
};

HomeworkDefinitionController.prototype.deleteSomeHomeworks = (req, res, next) => {
  var idArray = req.body.idArray;
  async.waterfall([
    (done) => {
      HomeworkDefinition.update({_id: {$in: idArray}}, {isDeleted: true}, {multi: true}, done);
    },
    (docs, done) => {
      if (!docs) {
        return done({status: 400}, null);
      }
      HomeworkDefinition.find({_id: {$in: idArray}}, done);
    },
    (docs, done) => {
      async.map(docs, (homework, callback) => {
        if (homework.uri) {
          const id = homework.uri.split('/')[1];

          const operationInfo = {
            operatorId: req.session.user.id,
            operationType: 'DELETE'
          };
          apiRequest.put(`homeworkQuizzes/${id}`, operationInfo, callback);
        } else {
          callback();
        }
      }, done);
    }
  ], (err) => {
    if (err && err.status) {
      return res.sendStatus(constant.httpCode.BAD_REQUEST);
    }
    if (err) {
      return next(err);
    }
    return res.sendStatus(constant.httpCode.NO_CONTENT);
  });
};

HomeworkDefinitionController.prototype.saveHomework = (req, res, next) => {
  const id = req.params.dataId;
  const files = req.files;
  let updateFun;
  let condition;
  if (req.body.buildNumber) {
    condition = {id, buildNumber: req.body.buildNumber};
    updateFun = homeworkDefService.updateBuildNumber;
  } else {
    condition = Object.assign({}, req.body, {id: id}, files, {status: parseInt(req.body.status)});
    updateFun = homeworkDefService.save;
  }
  updateFun(condition, (err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(constant.httpCode.NO_CONTENT);
  });
};

HomeworkDefinitionController.prototype.searchStatus = (req, res) => {
  let {id} = req.params;
  homeworkDefService.getHomeworkDefinition({id}, (err, data) => {
    if (!err && data) {
      res.status(constant.httpCode.OK).send({data: data.toJSON()});
    } else {
      res.status(constant.httpCode.NOT_FOUND).send({status: 0});
    }
  });
};

HomeworkDefinitionController.prototype.updateHomework = (req, res, next) => {
  const homeworkId = req.params.homeworkId;
  const condition = Object.assign({}, req.body, {homeworkId: homeworkId, buildNumber: 0, result: '排队中,请稍候...'});
  homeworkDefService.update(condition, (err, result) => {
    if (err) {
      return next(err);
    }
    return res.sendStatus(constant.httpCode.NO_CONTENT);
  });
};

HomeworkDefinitionController.prototype.insertHomework = (req, res, next) => {
  homeworkDefService.create(req.body, (err, data) => {
    if (err && err.status === constant.httpCode.NOT_FOUND) {
      res.send({status: constant.httpCode.NOT_FOUND});
    }
    if (err && err.status === constant.httpCode.BAD_REQUEST) {
      res.send({status: constant.httpCode.BAD_REQUEST});
    }
    if (err) {
      return next(err);
    } else {
      res.status(constant.httpCode.CREATED).send({id: data._id});
    }
  });
};

module.exports = HomeworkDefinitionController;
