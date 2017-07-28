const apiRequest = require('../services/api-request');
const constant = require('../mixin/constant');

class SingleChoiceController {
  create(req, res, next) {
    let singleChoice = req.body;
    singleChoice.options = singleChoice.options.toString();

    apiRequest.post('singleChoices', singleChoice, (err, resp) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send(resp.body);
    });
  }

  getOne(req, res, next) {
    const id = req.params.id;
    apiRequest.get(`singleChoices/${id}`, (err, resp) => {
      if (err) {
        return next(err);
      }
      let docs = resp.body;
      docs.options = docs.options.split(',');
      return res.status(constant.httpCode.OK).send(docs);
    });
  }

  update(req, res, next) {
    let singleChoice = req.body;
    singleChoice.options = singleChoice.options.toString();

    apiRequest.post('singleChoices', singleChoice, (err, resp) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send(resp.body);
    });
  }
}

module.exports = SingleChoiceController;

