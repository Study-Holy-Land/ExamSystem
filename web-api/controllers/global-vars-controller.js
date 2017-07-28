const constant = require('../mixin/constant');
const config = require('config');

class GlobalVarsController {
  getAll(req, res, next) {
    const featureToggle = config.get('globalVars');
    res.status(constant.httpCode.OK).send(featureToggle);
  }

}

module.exports = GlobalVarsController;
