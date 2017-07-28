'use strict';
var Token = require('../models/token');
var constant = require('../mixin/constant');
var async = require('async');
var authorityCtrl = require('../mixin/authority-controller');

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

module.exports = (req, res, next) => {
  const uuid = req.cookies.uuid;
  const url = req.url;
  let array = ['/register', '/login', '/weChat-login', '/user-detail/weChat', '/register/registerable', '/inspector', '/password', /^\/homework-definitions\/(.*)\/status$/, /^\/quiz\/scoring\/(.*)$/, /^\/homework\/scoring\/(.*)$/, /^\/stack-definitions\/(.*)$/, /^\/report\/(.*)$/];
  if (matchUrl(url, array)) {
    return next();
  }

  async.waterfall([
    (done) => {
      req.session.user ? done(null, null) : done(constant.httpCode.UNAUTHORIZED, null);
    },
    (data, done) => {
      Token.findOne({uuid}, (err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return done(constant.httpCode.UNAUTHORIZED, null);
        }
        done(null, null);
      });
    },
    (data, done) => {
      let authorityControl = authorityCtrl();
      authorityControl.forEach((item) => {
        if (matchUrl(url, item.originPath)) {
          return done(null, item);
        }
      });
      done(null, null);
    },
    (item, done) => {
      if (item) {
        req.session.user.role.forEach((data) => {
          if (item.role.indexOf(data) !== -1) {
            return done(null, null);
          }
        });
        return done(403, null);
      }
      done(null, null);
    }
  ], (err) => {
    if (err === constant.httpCode.UNAUTHORIZED) {
      return res.sendStatus(constant.httpCode.UNAUTHORIZED);
    }

    if (err === constant.httpCode.FORBIDDEN) {
      return res.sendStatus(constant.httpCode.FORBIDDEN);
    }
    if (err) {
      return next(err);
    }

    return next();
  });
};
