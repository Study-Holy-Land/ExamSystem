'use strict';
var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');

class ProfileController {
  getUserDetail(req, res, next) {
    const userId = req.session.user.id;
    apiRequest.get('users/' + userId + '/detail', (err, resp) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(resp.body);
    });
  }
}

module.exports = ProfileController;
