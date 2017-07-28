'use strict';
const apiRequest = require('../services/api-request');
const constant = require('../mixin/constant');

function StacksController() {
};

StacksController.prototype.getStacks = (req, res, next) => {
  apiRequest.get('stacks', (err, resp) => {
    if (err) {
      return next(err);
    }
    return res.status(constant.httpCode.OK).send(resp.body);
  });
};

module.exports = StacksController;
