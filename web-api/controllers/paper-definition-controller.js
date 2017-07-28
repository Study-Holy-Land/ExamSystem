'use strict';
var async = require('async');
var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var PaperDefinition = require('../models/paper-definition');
var unique = require('../tool/unique');
var addMakerName = require('../tool/addMakerName');
var formatSections = require('../tool/format-sections');

function PaperDefinitionController() {

}

PaperDefinitionController.prototype.getPaperDefinition = (req, res, next) => {
  var paperId = req.params.paperId;
  PaperDefinition.findOne({_id: paperId}, (err, data) => {
    if (!err && data) {
      res.status(200).send(data);
    } else {
      next();
    }
  });
};

PaperDefinitionController.prototype.savePaperDefinition = (req, res, next) => {
  var makerId = req.session.user ? req.session.user.id : 7;
  var createTime = parseInt(new Date().getTime() /
    constant.time.MILLISECOND_PER_SECONDS);

  var updateTime = createTime;
  var {paperName, description, sections, programId} = req.body.data;

  new PaperDefinition({
    programId,
    isDistributed: false,
    distributedTime: null,
    makerId,
    description,
    paperName,
    createTime,
    updateTime,
    isDeleted: false,
    uri: '',
    sections
  }).save((err, paper) => {
    if (!err && paper) {
      res.status(201).send({
        paperId: paper._id
      });
    } else {
      res.sendStatus(constant.BAD_REQUEST);
    }
  });
};

PaperDefinitionController.prototype.updatePaperDefinition = (req, res) => {
  var paperId = req.params.paperId;
  var updateTime = parseInt(new Date().getTime() /
    constant.time.MILLISECOND_PER_SECONDS);

  var {paperName, description, sections, programId} = req.body.data;
  PaperDefinition.update({_id: paperId},
    {$set: {programId, updateTime, paperName, description, sections}}, (err) => {
      if (!err) {
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
      }
    });
};

PaperDefinitionController.prototype.deletePaperDefinition = (req, res, next) => {
  var paperId = req.params.paperId;
  async.waterfall([
    (done) => {
      PaperDefinition.findByIdAndUpdate(paperId, {isDeleted: true}, done);
    },
    (doc, done) => {
      if (!doc) {
        return done({status: 400}, null);
      }
      PaperDefinition.findById(paperId, done);
    },
    (doc, done) => {
      if (!doc) {
        return done({status: 400}, null);
      }
      if (doc.uri) {
        const id = doc.uri.split('/')[3];
        var operationInfo = {
          operatorId: req.session.user.id,
          operatingTime: parseInt(new Date().getTime() /
            constant.time.MILLISECOND_PER_SECONDS),
          operationType: 'DELETE'
        };
        apiRequest.put(`papers/${id}`, operationInfo, done);
      }
      return done(null, doc);
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

PaperDefinitionController.prototype.getPaperDefinitionList = (req, res, next) => {
  let pageCount = req.query.pageCount || 10;
  let page = req.query.page || 1;
  let skipCount = pageCount * (page - 1);
  let papers;
  let order = req.query.order || '1';
  let sort = req.query.sort || 'updateTime';
  let sortData = {};
  sortData[sort] = order;

  PaperDefinition.find({isDeleted: false}).sort(sortData).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
    PaperDefinition.count({isDeleted: false}, (error, count) => {
      if (!err && !error && count && data) {
        var totalPage = Math.ceil(count / pageCount);
        let ids = data.map((paper) => {
          return paper.makerId;
        });
        let id = unique(ids);
        apiRequest.get('users/' + id + '/detail', (err, resp) => {
          if (!err && resp) {
            papers = addMakerName(resp, data);
            if (page === totalPage) {
              res.status(202); // 返回数据数量小于请求数量
            } else {
              res.status(200);
            }
            res.send({totalPage: totalPage, data: papers});
          } else {
            res.sendStatus(404);
          }
        });
      } else if (!err && !err) {
        res.send({data: []});
      } else {
        res.sendStatus(404);
      }
    });
  });
};

PaperDefinitionController.prototype.selectPaperDefinition = (req, res, next) => {
  var paperName = req.query.title;
  let pageCount = req.query.pageCount || 10;
  let page = req.query.page || 1;
  let skipCount = pageCount * (page - 1);
  let papers;

  PaperDefinition.find({isDeleted: false, paperName}).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
    PaperDefinition.count({isDeleted: false}, (error, count) => {
      if (!err && !error && count && data) {
        var totalPage = Math.ceil(count / pageCount);
        let ids = data.map((paper) => {
          return paper.makerId;
        });
        let id = unique(ids);
        apiRequest.get('users/' + id + '/detail', (err, resp) => {
          if (!err && resp) {
            papers = addMakerName(resp, data);
            if (page === totalPage) {
              res.status(202); // 返回数据数量小于请求数量
            } else {
              res.status(200);
            }
            res.send({totalPage: totalPage, data: papers});
          } else {
            res.sendStatus(404);
          }
        });
      } else {
        res.sendStatus(404);
      }
    });
  });
};

PaperDefinitionController.prototype.deleteSomePaperDefinition = (req, res, next) => {
  var idArray = req.body.idArray;

  async.waterfall([
    (done) => {
      PaperDefinition.update({_id: {$in: idArray}}, {isDeleted: true}, {multi: true}, done);
    },
    (docs, done) => {
      if (!docs) {
        return done({status: 400}, null);
      }
      PaperDefinition.find({_id: {$in: idArray}}, done);
    },
    (docs, done) => {
      async.map(docs, (paper, callback) => {
        if (paper.uri) {
          const id = paper.uri.split('/')[3];
          const operationInfo = {
            operatorId: req.session.user.id,
            operatingTime: parseInt(new Date().getTime() /
              constant.time.MILLISECOND_PER_SECONDS),
            operationType: 'DELETE'
          };
          apiRequest.put(`papers/${id}`, operationInfo, callback);
        } else {
          callback();
        }
      }, done);
    }
  ], (err, result) => {
    if (err && err.status) {
      return res.sendStatus(constant.httpCode.BAD_REQUEST);
    }
    if (err) {
      return next(err);
    }
    return res.sendStatus(constant.httpCode.NO_CONTENT);
  });
};

// PaperDefinitionController.prototype.distributePaperDefinition = (req, res) => {
//   var {paperName, description, sections, paperType, programId} = req.body.data;
//   var makerId = req.session.user.id;
//   var createTime = parseInt(req.body.data.createTime ? req.body.data.createTime : parseInt(new Date().getTime() /
//     constant.time.MILLISECOND_PER_SECONDS));
//   var updateTime = createTime;
//   var data;
//   new PaperDefinition({
//     programId,
//     uri: '',
//     paperName,
//     description,
//     paperType,
//     sections,
//     makerId,
//     isDistributed: false,
//     createTime,
//     updateTime,
//     isDeleted: false
//   }).save((err, paper) => {
//     if (err) {
//       return res.sendStatus(400);
//     }
//     var formattedSections = formatSections(sections);
//     data = {
//       makerId, createTime, programId, paperName, description, paperType, sections: formattedSections
//     };
//
//     apiRequest.post(`programs/${programId}/papers`, data, (error, resp) => {
//       if (!error && resp) {
//         var distributedTime = parseInt(new Date().getTime() / constant.time.MILLISECOND_PER_SECONDS);
//         PaperDefinition.update({_id: paper._id}, {uri: resp.body.uri, distributedTime, isDistributed: true}, (err) => {
//           if (!err) {
//             var uri = resp.body.uri;
//             return res.status(201).send(uri);
//           }
//           return res.sendStatus(401);
//         });
//       } else {
//         return res.sendStatus(402);
//       }
//     });
//   });
// };

PaperDefinitionController.prototype.operatePaperDefinitionById = (req, res, next) => {
  var {paperName, description, sections, programId} = req.body.data;
  var paperId = req.params.paperId;
  var operation = req.params.operation.toUpperCase();
  var makerId = req.session.user ? req.session.user.id : 7;
  var updateTime = parseInt(new Date().getTime() / constant.time.MILLISECOND_PER_SECONDS);
  var formattedSections = formatSections(sections);
  var data = {
    makerId,
    createTime: updateTime,
    programId,
    operation,
    paperName,
    description,
    sections: formattedSections
  };

  async.waterfall([
    (done) => {
      PaperDefinition.findById(paperId, done);
    },
    (doc, done) => {
      if (!doc.uri) {
        apiRequest.post(`programs/${programId}/papers`, data, (error, resp) => {
          if (!error && resp) {
            var distributedTime = parseInt(new Date().getTime() / constant.time.MILLISECOND_PER_SECONDS);
            PaperDefinition.update({_id: paperId}, {
              uri: resp.body.uri,
              distributedTime,
              paperName: data.paperName,
              description: data.description,
              programId: data.programId,
              sections: sections,
              isDistributed: operation === 'DISTRIBUTION'
            }, (err) => {
              if (!err) {
                var uri = resp.body.uri;
                return res.status(204).send(uri);
              }
              return done(err, null);
            });
          } else {
            return done(error, null);
          }
        });
      } else {
        apiRequest.post(doc.uri, data, (error) => {
          if (error) {
            return done(error, null);
          }
          var distributedTime = parseInt(new Date().getTime() / constant.time.MILLISECOND_PER_SECONDS);
          PaperDefinition.update({_id: paperId}, {
            distributedTime,
            isDistributed: operation === 'DISTRIBUTION'
          }, (err) => {
            if (err) {
              return done(err, null);
            }
            return res.sendStatus(204);
          });
        });
      }
    }
  ], (err) => {
    if (err) {
      return next(err);
    }
    return res.sendStatus(204);
  });
};

module.exports = PaperDefinitionController;
