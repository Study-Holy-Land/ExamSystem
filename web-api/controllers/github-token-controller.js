'use strict';

const async = require('async');
const constant = require('../mixin/constant');
const GithubToken = require('../models/github-token');

function githubTokenController() {

};

githubTokenController.prototype.updateGithubToken = (req, res, next) => {
  const id = req.body.id;
  const githubToken = req.body.githubToken;

  async.waterfall([
    (done) => {
      GithubToken.findOneAndUpdate(id, {$set: {githubToken}}, done);
    }, (doc, done) => {
      if (!doc) {
        GithubToken.create({id, githubToken}, done);
      }
      done(null, null);
    }], (err, data) => {
    if (err) {
      throw err;
    } else {
      res.sendStatus(204);
    }
  });
};

githubTokenController.prototype.getGithubToken = (req, res, next) => {
  GithubToken.findOne({id: 1}, (err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return res.sendStatus(constant.httpCode.NOT_FOUND);
    }
    return res.status(constant.httpCode.OK).send(doc);
  });
};

module.exports = githubTokenController;
