const apiRequest = require('../services/api-request');
const constant = require('../mixin/constant');

class BasicBlankQuizController {
  create(req, res, next) {
    apiRequest.post('basicBlankQuizzes', req.body, (err, resp) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send(resp.body);
    });
  }

  getOne(req, res, next) {
    apiRequest.get(`basicBlankQuizzes/${req.params.id}`, (err, resp) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(resp.body);
    });
  }

  update(req, res, next) {
    apiRequest.post('basicBlankQuizzes', req.body, (err, resp) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send(resp.body);
    });
  }
}

module.exports = BasicBlankQuizController;

