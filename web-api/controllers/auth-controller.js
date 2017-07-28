'use strict';
var apiRequest = require('../services/api-request');
var async = require('async');
var request = require('superagent');
var constant = require('../mixin/constant');
var md5 = require('js-md5');

var clientId = 'ce0a67bb236aaabe4cd6';
var clientSecret = '0e294a6b832bd6365f5186502a794116730bc092';
var redirectUri = 'http://192.168.99.100:8888/api/auth/github/callback';
var scope = '';
var state = Math.random();

function AuthController() {

}

AuthController.prototype.loginWithGitHub = (req, res) => {
  var authUrl = 'https://github.com/login/oauth/authorize?' +
    'client_id=' + clientId +
    '&redirect_uri=' + redirectUri +
    '&scope=' + scope +
    '&state' + state;
  res.redirect(authUrl);
};

AuthController.prototype.gitHubCallback = (req, res, next) => {
  var githubUserId;
  var userData = {
    email: '',
    mobilePhone: '',
    password: ''
  };
  userData.password = md5(userData.password);

  async.waterfall([
    (done) => {
      request.post('https://github.com/login/oauth/access_token')
        .set('Content-Type', 'application/json')
        .send({
          'client_id': clientId,
          'client_secret': clientSecret,
          'code': req.query.code,
          'redirect_uri': redirectUri
        })
        .end((err, response) => {
          done(err, response.body.access_token);
        });
    },
    (data, done) => {
      request
        .get('https://api.github.com/user?access_token=' + data)
        .set('Content-Type', 'application/json')
        .end(done);
    },
    (data, done) => {
      githubUserId = data.body.id;
      var queryData = {'thirdPartyUserId': githubUserId};
      var uri = 'auth/thirdParty/github';
      apiRequest.get(uri, queryData, (err, resp) => {
        done(!err, err);
      });
    },
    (err, done) => {
      if (err.status === constant.httpCode.NOT_FOUND) {
        apiRequest.post('register', userData, (err, res) => {
          var result = {userId: res.body.id, thirdPartyUserId: githubUserId};
          done(err, result);
        });
      } else {
        done(err);
      }
    },
    (data, done) => {
      apiRequest.post('auth/thirdParty/github', data, done);
    }
  ], (err) => {
    if (err && err !== true) {
      return next(err);
    } else {
      apiRequest.post('login', {email: userData.email, password: userData.password}, (err, data) => {
        if (data) {
          req.session.user = {
            id: data.body.id,
            role: data.body.role,
            userInfo: data.body.userInfo
          };
          res.redirect('/user-center');
        } else {
          return next(err);
        }
      });
    }
  });
};

module.exports = AuthController;
