'use strict';

var PasswordController = require('../../controllers/password-controller');
var apiRequest = require('../../services/api-request');
var emailServer = require('../../services/email');
var constant = require('../../mixin/constant');

describe('PasswordController', function () {

  describe('retrieve', ()=> {
    var controller;

    beforeEach(()=> {
      controller = new PasswordController();
    });

    it('should return status 200 when verify user is exist and send email success  ', (done)=> {

      spyOn(apiRequest, 'get').and.callFake(function (url, body, callback) {
        callback(null, {
          body: {
            status: constant.httpCode.OK,
            token: 'gdesagrjehnfjwaf'
          }
        });
      });

      spyOn(emailServer, 'sendEmail').and.callFake(function (url, body, callback) {
        callback(
            null
            , {
              status: constant.httpCode.OK
            });
      });

      controller.retrieve({
        query: {
          email: '224577147@qq.com'
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.OK
          });
          done();
        }
      });

    });

    it('should return status 404 when verify user is not exist ', (done)=> {
      spyOn(apiRequest, 'get').and.callFake(function (url, body, callback) {
        callback(null, {
          body: {
            status: constant.httpCode.NOT_FOUND,
            token: 'gdesagrjehnfjwaf'
          }
        });
      });

      spyOn(emailServer, 'sendEmail').and.callFake(function (url, body, callback) {
        callback(
            true, {
              status: constant.httpCode.NOT_FOUND
            });
      });

      controller.retrieve({
        query: {
          email: '224577147@qq.com'
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.NOT_FOUND
          });
          done();
        }
      });

    });

    it('should return status 404 and when verify user is exist but send email fail', (done)=> {

      spyOn(apiRequest, 'get').and.callFake(function (url, body, callback) {
        callback(null, {
          body: {
            status: constant.httpCode.OK,
            token: 'gdesagrjehnfjwaf'
          }
        });
      });

      spyOn(emailServer, 'sendEmail').and.callFake(function (url, body, callback) {
        callback(
            true
            , {
              status: constant.httpCode.NOT_FOUND
            });
      });

      controller.retrieve({
        query: {
          email: '224577147@qq.com'
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.NOT_FOUND
          });
          done();
        }
      });
    });

  });


  describe('reset', ()=> {
    var controller;

    beforeEach(()=> {
      controller = new PasswordController();
    });

    it('should return status 200 when reset password success  ', (done)=> {

      spyOn(apiRequest, 'post').and.callFake(function (url, body, callback) {
        callback(null, {
          body: {
            status: constant.httpCode.OK
          }
        });
      });

      controller.reset({
        body: {
          newPassword: '22457714',
          token: 'fjewjwoifjsafjekwlfrhjwi'
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.OK
          });
          done();
        }
      });

    });

    it('should return status 403 when verify user is not exist ', (done)=> {

      spyOn(apiRequest, 'post').and.callFake(function (url, body, callback) {
        callback(null, {
          body: {
            status: constant.httpCode.FORBIDDEN
          }
        });
      });

      controller.reset({
        body: {
          newPassword: '22457714',
          token: 'fjewjwoifjsafjekwlfrhjwi'
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.FORBIDDEN
          });
          done();
        }
      });
    });

    it('should return status 412 when submit is time out ', (done)=> {

      spyOn(apiRequest, 'post').and.callFake(function (url, body, callback) {
        callback(null, {
          body: {
            status: constant.httpCode.PRECONDITION_FAILED
          }
        });
      });

      controller.reset({
        body: {
          newPassword: '22457714',
          token: 'fjewjwoifjsafjekwlfrhjwi'
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.PRECONDITION_FAILED
          });
          done();
        }
      });
    });

  });

});