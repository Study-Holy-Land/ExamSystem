'use strict';
const request = require('superagent');
const config = require('config');
const async = require('async');
const apiRequest = require('../services/api-request');
const constant = require('../mixin/constant');
const Stack = require('../models/stack');

function StacksController() {
};

StacksController.prototype.getAll = (req, res, next) => {
  async.series({
    items: (done) => {
      Stack.find(done);
    },
    totalCount: (done) => {
      Stack.count(done);
    }
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    return res.status(constant.httpCode.OK).send(result);
  });
};

StacksController.prototype.getOne = (req, res, next) => {
  apiRequest.get(`stacks/${req.params.stackId}`, (err, resp) => {
    if (err) {
      return next(err);
    }
    if (resp.statusCode === 404) {
      return res.sendStatus(constant.httpCode.NOT_FOUND);
    }
    return res.status(constant.httpCode.OK).send(resp.body);
  });
};

StacksController.prototype.create = (req, res, next) => {
  let stack = req.body;
  const definitions = stack.definition.split(':');
  request
    .get(`https://registry.hub.docker.com/v1/repositories/${definitions[0]}/tags`)
    .end((err, response) => {
      if (err && err.status === constant.httpCode.NOT_FOUND) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      } else if (err) {
        return next(err);
      }
      if (response.statusCode !== constant.httpCode.OK) {
        return res.sendStatus(constant.httpCode.BAD_REQUEST);
      }

      const tags = response.body;
      const exit = tags.find((tag) => {
        return tag.name === definitions[1];
      });
      if (definitions.length !== 2 && !exit) {
        return res.sendStatus(constant.httpCode.BAD_REQUEST);
      }

      const newStack = Object.assign(stack, {status: constant.addStackStatus.PENDING, message: ''});

      Stack.create(newStack, (err, doc) => {
        if (err) {
          return res.sendStatus(constant.httpCode.DUPLICATE_CONTENT);
        }
        const callbackUrl = `${config.get('task.callback_url')}/${doc._id}`;
        res.status(constant.httpCode.OK).send(doc);
        request
          .post(config.get('task.buildImage'))
          .type('form')
          .send({image: req.body.definition, callback_url: callbackUrl})
          .end(() => {
            stack = null;
          });
      });
    });
};

StacksController.prototype.update = (req, res, next) => {
  const stackId = req.params.stackId;
  const {status, result} = req.body;
  let updateFun;
  let condition;

  if (req.body.buildNumber) {
    condition = {stackId, buildNumber: req.body.buildNumber};
    updateFun = updateBuildNumber;
  } else {
    condition = {stackId, status, result};
    updateFun = updateStack;
  }

  updateFun(condition, (err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      res.sendStatus(constant.httpCode.NOT_FOUND);
    }
    return res.sendStatus(constant.httpCode.NO_CONTENT);
  });
};

StacksController.prototype.searchStatus = (req, res, next) => {
  const stackId = req.params.stackId;
  let stack;
  async.waterfall([
    (done) => {
      Stack.findById(stackId, done);
    },
    (doc, done) => {
      stack = doc;
      const getJenkinsLogs = config.get('task.getJenkinsLogs');
      if (stack.status === constant.addStackStatus.PENDING) {
        request.get(`${getJenkinsLogs}${stack.jobName}/${stack.buildNumber}/consoleText`)
          .end((err, res) => {
            if (err) {
              return done(null, stack);
            }
            stack.result = res.text;
            return done(null, stack);
          });
      } else {
        done(null, stack);
      }
    }
  ], (err, doc) => {
    if (err) {
      return next(err);
    }
    res.status(constant.httpCode.OK).send(doc);
  });
};

function updateBuildNumber({stackId, buildNumber}, callback) {
  Stack.findByIdAndUpdate(stackId, {buildNumber}, callback);
}

function updateStack({stackId, status, result}, callback) {
  async.waterfall([
    (done) => {
      let state;
      if (status !== 'SUCCESS') {
        state = constant.addStackStatus.ERROR;
      } else {
        state = constant.addStackStatus.SUCCESS;
      }
      Stack.findByIdAndUpdate(stackId, {status: state}, done);
    },
    (doc, done) => {
      if (status !== 'SUCCESS') {
        return done(true, null);
      }
      const stack = doc.toJSON();
      const data = {
        title: stack.title,
        definition: stack.definition,
        description: stack.description
      };
      apiRequest.post('stacks', data, done);
    }
  ], callback);
}

module.exports = StacksController;
