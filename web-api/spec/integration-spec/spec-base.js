'use strict';

var glob = require("glob");
var path = require("path");
var fs = require('fs');
var async = require('async');
var session = require('supertest-session');
var mongoTools = require('../support/fixture/mongo-tools');
var mockServer = require('../support/mock-server');
var app = require('../../app');

global.userSession = session(app);
global.adminSession = session(app);

function startServer(done) {
  mockServer.start({}, (err) => {
    done(err,null)
  })
}

function loginAsUser(data, done) {
  userSession.post('/login')
      .set('Content-Type', 'application/json')
      .send({
        account: 'test@163.com',
        password: '12345678'
      })
      .expect(200)
      .end(function(err, data) {
        done(err, null)
      });
}

function loginAsAdmin(data, done) {
  adminSession.post('/login')
      .set('Content-Type', 'application/json')
      .send({
        account: 'admin@admin.com',
        password: '12345678'
      })
      .expect(200)
      .end(function(err, data) {
        done(err, null)
      });
}

before(function(done) {
  async.waterfall([
    startServer,
    loginAsUser,
    loginAsAdmin
  ], function(err, data) {
    done(err);
  })
});

after(function(done) {
  mockServer.stop(done);
});

beforeEach(function(done) {
  mongoTools.refresh(done);
});
