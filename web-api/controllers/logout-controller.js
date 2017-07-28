'use strict';
// var apiRequest = require('../services/api-request');
// var async = require('async');
var Token = require('../models/token');
var constant = require('../mixin/constant');

function LogoutController() {

}

LogoutController.prototype.logout = (req, res, next) => {
  Token.findOneAndRemove({uuid: req.cookies.uuid}).exec((err, user) => {
    if (!err && user) {
      res.clearCookie('uuid', {path: '/'});
      res.clearCookie('authState');
      res.status(constant.httpCode.OK).end();
    } else {
      res.status(404).end();
      return;
    }
  });
};

module.exports = LogoutController;
