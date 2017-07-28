const apiRequest = require('../services/api-request');
const constant = require('../mixin/constant');

class MultipleChoiceController {
  create(req, res, next) {
    let multipleChoice = req.body;
    multipleChoice.options = multipleChoice.options.toString();

    apiRequest.post('multipleChoices', multipleChoice, (err, resp) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send(resp.body);
    });
  }

  getOne(req, res, next) {
    const id = req.params.id;
    apiRequest.get(`multipleChoices/${id}`, (err, resp) => {
      if (err) {
        return next(err);
      }
      let basicQuiz = resp.body;
      basicQuiz.options = basicQuiz.options.split(',');
      return res.status(constant.httpCode.OK).send(basicQuiz);
    });
  }

  update(req, res, next) {
    let multipleChoice = req.body;
    multipleChoice.options = multipleChoice.options.toString();

    apiRequest.post('multipleChoices', multipleChoice, (err, resp) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send(resp.body);
    });
  }
}

module.exports = MultipleChoiceController;

