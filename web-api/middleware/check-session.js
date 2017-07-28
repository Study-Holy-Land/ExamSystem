'use strict';

var getJumpControl = require('../mixin/jump-control');

function getType(o) {
  var typeStr = Object.prototype.toString.call(o).slice(8, -1);
  return typeStr;
}

function matchUrl(url, patterns) {
  return patterns.some((pattern) => {
    if (getType(pattern) === 'RegExp') {
      return pattern.test(url);
    } else {
      return url.indexOf(pattern) > -1;
    }
  });
}

function pathControl(url, session) {
  var target = {};
  var needRedirect = false;
  var jumpControl = getJumpControl(session);

  jumpControl.forEach((item) => {
    if (matchUrl(url, item.originPath) && item.condition) {
      target = item;
      needRedirect = true;
      return;
    }
  });

  return {
    needRedirect: needRedirect,
    status: target.status
  };
}

module.exports = (req, res, next) => {
  var target = pathControl(req.url, req.session);

  if (target.needRedirect) {
    res.sendStatus(target.status);
  } else {
    next();
  }
};
