const apiRequest = require('../services/api-request');
const async = require('async');
const Che = require('../models/che');
const UserChe = require('../models/user-che');
const httpCode = require('../mixin/constant').httpCode;
const superagent = require('superagent');
const cheInfoCreator = require('../mixin/che');

const cheServer = '192.168.1.109:8082';
const cheServer2 = '192.168.1.109:9999';
// const cheServer = '10.22.64.22:8081';

// const cheServer = '192.168.1.114:8081';

class CheController {

  getStudents(req, res, next) {
    async.waterfall([
      (done) => {
        apiRequest.get('users', {role: 0}, done);
      },
      (doc, done) => {
        const users = doc.body.items;
        async.map(users, (user, callback) => {
          UserChe.findOne({userId: user.id}, (err, result) => {
            const che = !!result;
            callback(err, {user, che});
          });
        }, (err, results) => {
          done(err, results);
        });
      }
    ], (err, result) => {
      if (err) {
        return next(err);
      }
      res.status(httpCode.OK).send(result);
    });
  }

  createChe(req, res, next) {
    let cheName = Date.now();
    let cheId;
    async.waterfall([
      (done) => {
        superagent.post(`http://${cheServer}/api/workspace`)
            .send(cheInfoCreator(cheName))
            .end((err, res) => {
              if (res.body) {
                done(err, res.body);
              } else {
                done(null);
              }
            });
      },
      (doc, done) => {
        if (doc.id) {
          Che.create({cheId: doc.id, name: cheName}, done);
        } else {
          done(null);
        }
      },
      (doc, done) => {
        if (doc._id) {
          cheId = doc._id;
          apiRequest.get('users/verification', {field: 'email', value: req.body.email}, done);
        } else {
          done(null);
        }
      },
      (data, done) => {
        if (cheId) {
          const userId = data.body.uri.split('/')[1];
          UserChe.create({userId, che: cheId}, done);
        } else {
          done(null);
        }
      }
    ], (err, result) => {
      if (err) {
        return next(err);
      }
      if (result._id) {
        res.sendStatus(httpCode.CREATED);
      } else {
        res.sendStatus(httpCode.NOT_FOUND);
      }
    });
  }

  deleteChe(req, res, next) {
    let deleteResult;
    let _id;
    async.waterfall([
      (done) => {
        apiRequest.get('users/verification', {field: 'email', value: req.body.email}, done);
      },
      (data, done) => {
        const userId = data.body.uri.split('/')[1];
        UserChe.findOne({userId})
            .populate('che')
            .exec(done);
      },
      (doc, done) => {
        _id = doc._id;
        if (doc.che.cheId) {
          const cheId = doc.che.cheId;
          const uri = `http://${cheServer}/api/workspace/${cheId}/check`;
          getCheStatus(uri, (res) => {
            const workspaceStatus = res.body.workspaceStatus;
            done(null, {workspaceStatus, cheId});
          });
        } else {
          done(null);
        }
      },
      (result, done) => {
        if (result.workspaceStatus !== 'STOPPED') {
          const uri = `http://${cheServer}/api/workspace/${result.cheId}`;
          loopStopChe(uri, (stopCheResult) => {
            if (stopCheResult) {
              done(null, {cheId: result.cheId});
            }
          });
        } else {
          done(null, result);
        }
      },
      (result, done) => {
        superagent.delete(`http://${cheServer}/api/workspace/${result.cheId}`)
            .end((err, res) => {
              deleteResult = res.statusCode;
              done(err, res.statusCode);
            });
      },
      (result, done) => {
        if (_id && result === httpCode.NO_CONTENT) {
          UserChe.findByIdAndRemove(_id, done);
        } else {
          done(null);
        }
      }],
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result) {
        res.sendStatus(deleteResult);
      } else {
        res.sendStatus(httpCode.NOT_FOUND);
      }
    }
    );

    function loopStopChe(uri, callback) {
      let isStopped;
      async.whilst(
          function condition() {
            return isStopped !== 'STOPPED';
          },
          function body(callback) {
            getCheStatus(uri + '/check', (res) => {
              isStopped = res.body.workspaceStatus;
              if (isStopped !== 'STOPPING') {
                superagent.delete(uri + '/runtime')
                    .end((err, res) => {
                      callback(err);
                    });
              }
            });
          },
          function end(err) {
            if (err) {
              throw err;
            }
            callback(true);
          });
    }

    function getCheStatus(uri, callback) {
      superagent.get(uri)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            callback(res);
          });
    }
  }

  getCheUrl(req, res, next) {
    const userId = req.session.user.id;
    let cheUrl;
    UserChe.findOne({userId})
        .populate('che')
        .exec((err, result) => {
          if (err) {
            return next(err);
          }
          if (result) {
            const cheName = result.che.name;
            cheUrl = `${cheServer2}/dashboard/#/ide/che/${cheName}`;
          }
          res.status(200).send({cheUrl});
        });
  }
}

module.exports = CheController;

