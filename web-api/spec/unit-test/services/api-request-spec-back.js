'use strict';

var apiRequest = require('../../services/api-request');
var superAgent = require('superagent');
const config = require('config');

describe('apiRequest', function () {
  describe('get', function () {

    var testData = {};

    beforeEach(function () {
      spyOn(superAgent, 'get').and.returnValue({
        set: function () {
          return this;
        },
        query: function (data) {
          testData = data;
          return this;
        },
        end: function (callback) {
          callback({data: 'OK'});
        }
      });
    });

    afterEach(function () {
      testData = {};
    });

    it('should invoke superagent get', function () {
      apiRequest.get('papers/enrollment', function (data) {
        expect(data).toEqual({
          data: 'OK'
        });
      });

      expect(superAgent.get).toHaveBeenCalledWith(config.get('apiServer') + 'papers/enrollment');
    });

    it('should invoke superagent get with query', function () {
      apiRequest.get('papers/enrollment', {id: 1}, function (data) {
        expect(data).toEqual({
          data: 'OK'
        });
      });

      expect(superAgent.get).toHaveBeenCalledWith(config.get('apiServer') + 'papers/enrollment');
      expect(testData).toEqual({id: 1});
    });

  });

  describe('post', function () {

    var testData = {};

    beforeEach(function () {
      spyOn(superAgent, 'post').and.returnValue({
        set: function () {
          return this;
        },
        send: function (data) {
          testData = data;
          return this;
        },
        end: function (callback) {
          callback({data: 'OK'});
        }
      });
    });

    afterEach(function () {
      testData = {};
    });

    it('should invoke superagent post', function () {
      apiRequest.post('papers/enrollment', {id: 1}, function (data) {
        expect(data).toEqual({
          data: 'OK'
        });
      });

      expect(superAgent.post).toHaveBeenCalledWith(config.get('apiServer') + 'papers/enrollment');
      expect(testData).toEqual({id: 1});
    });

  });

});