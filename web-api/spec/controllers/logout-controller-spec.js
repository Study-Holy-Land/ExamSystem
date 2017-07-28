'use strict';

var LogoutController = require('../../controllers/logout-controller');
var constant = require('../../mixin/constant');
var apiRequest = require('../../services/api-request');


describe('LogoutController', function () {
  describe('logout', ()=> {
    var controller;

    beforeEach(function () {
      controller = new LogoutController();
    });

    it('should redirect to register.html when logout success', function (done) {

      spyOn(apiRequest, 'post').and.callFake(function (url, body, callback) {
        callback(null, {
          status: constant.httpCode.CREATED
        });
      });

      controller.logout({
        session: {
          user: {
            id: 1
          },
          destroy: function (callback) {
            callback();
          }
        }
      }, {
        redirect: function (data) {
          expect(data).toEqual('/join');
          done();
        }
      });

    });
  });
});