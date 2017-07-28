'use strict';
var path = require('path');

module.exports = (req, res) => {
  var isAjaxRequest = req.xhr;

  if (isAjaxRequest) {
    res.send({
      status: 404,
      message: 'Error Request !'
    });
  } else {
    res.sendFile(path.join(__dirname, '../public/assets', '404.html'));
  }
};
