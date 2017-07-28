var express = require('express');
var router = express.Router();
var Token = require('../../models/token');

router.get('/', (req, res, next) => {
  const uuid = req.cookies.uuid;
  Token.findOne({uuid}, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.sendStatus(200);
    }
    return res.sendStatus(403);
  });
});
module.exports = router;
