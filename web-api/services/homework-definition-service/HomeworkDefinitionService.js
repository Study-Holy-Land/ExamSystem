const async = require('async');
const config = require('config');
const request = require('superagent');
const constant = require('../../mixin/constant');
const apiRequest = require('../api-request');
const HomeworkDefinition = require('../../models/homework-definition');
const unique = require('../../tool/unique');
const addMakerName = require('../../tool/addMakerName');
const path = require('path');
const mv = require('mv');
const fs = require('fs');
const GithubToken = require('../../models/github-token');

class HomeworkDefinitionService {
  getHomeworkList({pageCount, page, order, sort}, callback) {
    let homeworks;
    let totalPage = 0;
    let sortData = {};
    sortData[sort] = order;
    let skipCount = pageCount * (page - 1);

    async.waterfall([
      (done) => {
        HomeworkDefinition.find({isDeleted: false}).sort(sortData).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
          done(err, data);
        });
      },
      (data, done) => {
        homeworks = data;
        let id;
        HomeworkDefinition.count({isDeleted: false}, (error, count) => {
          if (!error && count && data) {
            totalPage = Math.ceil(count / pageCount);
            let ids = data.map((homework) => {
              return homework.makerId;
            });
            id = unique(ids);
          }
          done(error, id, homeworks);
        });
      },
      (dataOne, dataSecond, done) => {
        if (dataSecond.length === 0) {
          return done(null, []);
        }
        apiRequest.get('users/' + dataOne + '/detail', (err, resp) => {
          if (!err && resp) {
            homeworks = addMakerName(resp, dataSecond);
          }
          done(err, homeworks);
        });
      },
      (data, done) => {
        apiRequest.get('stacks', (err, resp) => {
          let stacks = resp.body.items;
          if (stacks.length === 0) {
            return done(err, {data: [], totalPage});
          }

          var homeworks = [];
          data.map((homework) => {
            const item = stacks.find(item => homework.stackId === item.stackId);
            let stack = {};
            if (item) {
              stack = {
                stackId: item.stackId,
                title: item.title
              };
              homeworks.push(Object.assign({}, homework, {stack}));
            }
          });
          return done(err, {data: homeworks, totalPage});
        });
      }
    ], (err, data) => {
      callback(err, data);
    });
  }

  create(data, callback) {
    const {definitionRepo, name, stackId} = data;
    let result = {};
    async.waterfall([
      (done) => {
        HomeworkDefinition.create({definitionRepo, name, stackId}, (err, date) => {
          if (err) {
            return done({status: 400}, null);
          }
          done(null, date);
        });
      }, (data, done) => {
        GithubToken.findOne({id: 1}, (err, doc) => {
          if (!doc) {
            return done({status: 404}, null);
          }
          done(err, {data, doc});
        });
      }, ({data, doc}, done) => {
        result = data.toJSON();
        const callbackUrl = `${config.get('task.hookUrl')}/homework-definitions/${result._id}/status`;
        request
          .post(config.get('task.addHomework'))
          .type('form')
          .send({git: definitionRepo, callback_url: callbackUrl, github_token: doc.githubToken})
          .end(done);
      }],
    (err) => {
      callback(err, result);
    });
  }

  save(condition, callback) {
    const {readme, status, result, script, answer, id, templateRepository} = condition;
    const createTime = parseInt(new Date().getTime() /
      constant.time.MILLISECOND_PER_SECONDS);
    const evaluateScript = script ? `./${script[0].path}` : '';
    const answerFilename = answer ? answer[0].filename : '';
    const descriptionFileName = readme ? readme[0].filename : '';
    const descriptionPath = path.resolve(__dirname, `../../homework-script/${descriptionFileName}`);
    const answerPath = `./homework-answer/${answerFilename}`;
    let homeworkQuiz = {
      description: '',
      status,
      makerId: 1,
      isDeleted: false,
      uri: '',
      answerPath,
      createTime,
      evaluateScript,
      templateUrl: '',
      result,
      templateRepository
    };

    if (status === constant.createHomeworkStatus.SUCCESS) {
      async.waterfall([
        (done) => {
          fs.stat(descriptionPath, (err, stat) => {
            done(err, stat);
          });
        },
        (stat, done) => {
          fs.readFile(descriptionPath, {encoding: 'utf8'}, (err, data) => {
            if (!err && data) {
              homeworkQuiz.description = data;
            }
            done(err);
          });
        },
        (done) => {
          mv(path.resolve(__dirname, `../../homework-script/${answerFilename}`), path.resolve(__dirname, `../../homework-answer/${answerFilename}`), (err) => {
            done(err);
          });
        },
        (done) => {
          HomeworkDefinition.findById(id, (err, doc) => {
            done(err, doc);
          });
        },
        (doc, done) => {
          const homeworkInfo = {
            'description': homeworkQuiz.description,
            'evaluateScript': evaluateScript,
            'templateRepository': templateRepository,
            'makerId': 1,
            'answerPath': answerPath,
            'createTime': createTime,
            'homeworkName': doc.toJSON().name.toString(),
            'stackId': doc.toJSON().stackId
          };

          if (doc.uri) {
            Object.assign(homeworkInfo, {operationType: 'UPDATE'});
            const homeworkId = doc.uri.split('/')[1];

            apiRequest.put(`homeworkQuizzes/${homeworkId}`, homeworkInfo, done);
          } else {
            apiRequest.post('homeworkQuizzes', homeworkInfo, done);
          }
        },
        (resp, done) => {
          homeworkQuiz.uri = resp.body.uri;
          HomeworkDefinition.findByIdAndUpdate(id, homeworkQuiz, done);
        }
      ], (err) => {
        return callback(err);
      });
    } else {
      HomeworkDefinition.findByIdAndUpdate(id, homeworkQuiz, (err) => {
        return callback(err);
      });
    }
  }

  updateBuildNumber(condition, callback) {
    const {id, buildNumber} = condition;
    HomeworkDefinition.findByIdAndUpdate(id, {buildNumber}, callback);
  }

  getHomeworkDefinition({id}, callback) {
    let definition;
    let status;
    async.waterfall([
      (done) => {
        HomeworkDefinition.findById(id, done);
      },
      (doc, done) => {
        definition = doc;
        status = definition.status;
        const getJenkinsLogs = config.get('task.getJenkinsLogs');
        if (status === 1) {
          request.get(`${getJenkinsLogs}${definition.jobName}/${definition.buildNumber}/consoleText`)
            .end((err, res) => {
              if (err) {
                return done(null, definition);
              }
              definition.result = res.text;
              return done(null, definition);
            });
        } else {
          done(null, definition);
        }
      }
    ], callback);
  }

  update(condition, callback) {
    const {name, stackId, definitionRepo, buildNumber, result, homeworkId} = condition;
    const callbackUrl = `${config.get('task.hookUrl')}/homework-definitions/${homeworkId}/status`;
    async.waterfall([
      (done) => {
        HomeworkDefinition.update({_id: homeworkId}, {
          $set: {
            name,
            stackId,
            definitionRepo,
            buildNumber,
            result,
            status: constant.createHomeworkStatus.PEDDING
          }
        }, done);
      },
      (data, done) => {
        GithubToken.findOne({id: 1}, (err, doc) => {
          if (!doc) {
            return done({status: 404}, null);
          }
          done(err, {data, doc});
        });
      },
      ({data, doc}, done) => {
        request
          .post(config.get('task.addHomework'))
          .type('form')
          .send({git: definitionRepo, callback_url: callbackUrl, github_token: doc.githubToken})
          .end(done);
      }], (err, result) => {
      if (err) {
        return HomeworkDefinition.update({_id: homeworkId}, {$set: {status: constant.createHomeworkStatus.ERROR}}, callback);
      }
      return callback(err, result);
    });
  }
}

module.exports = HomeworkDefinitionService;
