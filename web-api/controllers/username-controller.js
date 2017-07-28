var apiRequest = require('../services/api-request');
var Token = require('../models/token');

function UsernameController() {

}

UsernameController.prototype.getUsername = (req, res, next) => {
  var uuid = req.cookies.uuid;
  Token.findOne({uuid}).exec((err, user) => {
    if (!err && user) {
      apiRequest.get(`users/${user.id}/detail`, (err, resp) => {
        if (!err && resp) {
          res.status(200).send({username: resp.body.userName});
        } else {
          res.sendStatus(404);
        }
      });
    } else {
      next();
    }
  });
};

module.exports = UsernameController;
