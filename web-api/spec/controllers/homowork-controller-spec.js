'use strict';

var HomeworkController = require('../../controllers/homework-controller');
var userHomeworkQuizzes = require('../../models/user-homework-quizzes');
var constant = require('../../mixin/constant');
var apiRequest = require('../../services/api-request');
var request = require('superagent');

var noop = function () {};

describe('HomeworkController', function () {
  xdescribe('getList', () => {
    var controller;

    beforeEach(function () {
      controller = new HomeworkController();
    });

    it('should return homeworkQuizzes when receive a request', function (done) {

      spyOn(userHomeworkQuizzes, 'getQuizStatus').and.callFake(function (id, done) {

        var data = [{
          status: 2
        }, {
          status: 1
        }, {
          status: 1
        }, {
          status: 1
        }, {
          status: 1
        }, {
          status: 1
        }];

        done(null, data);
      });

      controller.getList({
        session: {
          user: {id: 1}
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.OK,
            homeworkQuizzes: [{
              status: 2
            }, {
              status: 1
            }, {
              status: 1
            }, {
              status: 1
            }, {
              status: 1
            }, {
              status: 1
            }]
          });
          done();
        }
      });
    });
  });

  xdescribe('getQuiz', () => {
    var controller;

    beforeEach(function () {
      controller = new HomeworkController();

      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function () {
        return {
          populate: function () {
            return this;
          },
          exec: function (done) {
            var data = {
              userId: 1,
              save: function () {
              },
              quizzes: [
                {
                  id: 1,
                  status: constant.homeworkQuizzesStatus.ACTIVE,
                  homeworkSubmitPostHistory: [{
                    status: constant.homeworkQuizzesStatus.ACTIVE,
                    homeworkURL: 'w',
                    branch: 'dev'
                  }]
                }, {
                  id: 2,
                  status: constant.homeworkQuizzesStatus.LOCKED
                }, {
                  id: 3,
                  status: constant.homeworkQuizzesStatus.LOCKED
                }
              ]
            };

            done(null, data);
          },
          select: function () {
            return this;
          }
        };
      });

      spyOn(userHomeworkQuizzes, 'getQuizStatus').and.callFake(function (id, done) {

        var data = [{
          status: 2
        }, {
          status: 1
        }, {
          status: 1
        }, {
          status: 1
        }, {
          status: 1
        }, {
          status: 1
        }];

        done(null, data);
      });
    });

    it('should return quiz and statusCode: 200 when receive a request', (done) => {

      spyOn(apiRequest, 'get').and.callFake(function (url, callback) {
        var data = {
          body: {
            id: 1,
            description: '这是一道简单的题',
            templateRepository: 'www.github.com',
            answerPath:"answerPath"
          }
        };
        callback(null, data);
      });

      controller.getQuiz({
        session: {user: {id: 1}},
        query: {orderId: 1}
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.OK,
            quiz: {
              quizStatus: constant.homeworkQuizzesStatus.ACTIVE,
              desc: '这是一道简单的题',
              templateRepo: 'www.github.com',
              userAnswerRepo: 'w',
              branch: 'dev'
            },
            answerPath:"answerPath"
          });
          done();
        },
        status: noop
      });
    });

    it('should return statusCode: 403 when request quiz is locked', (done) => {

      controller.getQuiz({
        session: {user: {id: 1}},
        query: {orderId: 3}
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.FORBIDDEN
          });
          done();
        },
        status: noop

      });
    });
  });

  xdescribe('saveGithubUrl', ()=> {

    var controller;
    var lockedData;
    var activeData;
    var progressData;
    var successData;
    var errorData;

    beforeEach(()=> {
      controller = new HomeworkController();
      lockedData = {
        userId: 1,
        quizzes: [
          {
            id: 1,
            status: constant.homeworkQuizzesStatus.LOCKED,
            userAnswerRepo: 'www.github.com'
          }
        ]
      };

      activeData = {
        userId: 1,
        quizzes: [
          {
            id: 1,
            status: constant.homeworkQuizzesStatus.ACTIVE,
            userAnswerRepo: 'www.github.com'
          }
        ]
      };

      progressData = {
        userId: 1,
        quizzes: [
          {
            id: 1,
            status: constant.homeworkQuizzesStatus.PROGRESS,
            userAnswerRepo: 'www.github.com'
          }
        ]
      };

      successData = {
        userId: 1,
        quizzes: [
          {
            id: 1,
            status: constant.homeworkQuizzesStatus.SUCCESS,
            userAnswerRepo: 'www.github.com'
          }
        ]
      };

      errorData = {
        userId: 1,
        quizzes: [
          {
            id: 1,
            status: constant.homeworkQuizzesStatus.ERROR,
            userAnswerRepo: 'www.github.com'
          }
        ]
      };

      spyOn(userHomeworkQuizzes, 'getQuizStatus').and.callFake(function (id, done) {

        var data = [{
          status: 2
        }, {
          status: 1
        }, {
          status: 1
        }, {
          status: 1
        }, {
          status: 1
        }, {
          status: 1
        }];

        done(null, data);
      });

      spyOn(userHomeworkQuizzes, 'findOne').and.callFake(function () {
        return {
          populate: function () {
            return this;
          },
          exec: function (done) {
            var data = {
              userId: 1,
              save: function (callback) {
                callback(null, true, true);
              },
              quizzes: [
                {
                  id: 1,
                  status: constant.homeworkQuizzesStatus.ACTIVE,
                  uri: 'homeworkQuizzes/1',
                  homeworkSubmitPostHistory: [{
                    status: constant.homeworkQuizzesStatus.ACTIVE,
                    homeworkURL: 'w',
                    branch: 'dev'
                  }]
                }, {
                  id: 2,
                  status: constant.homeworkQuizzesStatus.LOCKED
                }, {
                  id: 3,
                  status: constant.homeworkQuizzesStatus.LOCKED
                }
              ]
            };

            done(null, data);
          },
          select: function () {
            return this;
          }
        };
      });

      spyOn(userHomeworkAnswer, 'create').and.callFake(function (data, callback) {
        callback(null, {
          _id: 'asdfasdfasdfasdf'
        });
      });

      spyOn(apiRequest, 'get').and.callFake(function (url, callback) {
        var data = {
          body: {
            id: 1,
            description: '这是一道简单的题',
            templateRepository: 'www.github.com',
            evaluateScript: 'www.github.com'
          }
        };
        callback(null, data);
      });

      spyOn(request, 'post').and.callFake(function () {
        return {
          set: function () {
            return this;
          },
          send: function () {
            return this;
          },
          end: function (fn) {
            fn(null, {
              status: constant.httpCode.OK
            });
          }
        };
      });
    });

    it('it should return status 200 when change status to progress and  save userAnswerUrl success', (done)=> {

      controller.saveGithubUrl({
        session: {user: {id: 1}},
        body: {
          userAnswerRepo: 'www.repo.com',
          orderId: 1,
          branch: 'dev',
          version: 'asdfasdfasdfasdf'
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            status: constant.httpCode.OK
          });
          done();
        },
        status: noop
      }, noop);
    });

    it('it should return status 500 when orderId is out of range ', (done)=> {

      controller.saveGithubUrl({
        session: {user: {id: 1}},
        body: {
          userAnswerRepo: 'www.repo.com',
          orderId: 121
        }
      }, {
        sendStatus: function (data) {
          expect(data).toEqual(constant.httpCode.INTERNAL_SERVER_ERROR);
          done();
        },
        status: noop
      }, noop);

    });

    it('it should return status 403  when do not save userAnswerUrl', (done)=> {
      controller.saveGithubUrl({
        session: {user: {id: 1}},
        body: {
          userAnswerRepo: 'www.repo.com',
          orderId: 2
        }
      }, {
        sendStatus: function (data) {
          expect(data).toEqual(constant.httpCode.INTERNAL_SERVER_ERROR);
          done();
        },
        status: noop
      }, noop);
    });
  });

  describe('getEstimatedTime', () => {
    var homewrokController;

    beforeEach(() => {
      homewrokController = new HomeworkController();
    });

    it('should return 10', (done) => {
      spyOn(userHomeworkQuizzes, 'aggregate').and.returnValue({
        match: function () {
          return this;
        },
        exec: function (callback) {
          callback(null, [{
            quizzes: {
              homeworkSubmitPostHistory: [
                '57198861b9eb750600f92eea'
              ]
            }
          }]);
        }
      });

      spyOn(request, 'get').and.returnValue({
        set: function () {
          return this;
        },
        query: function (data) {
          return this;
        },
        end: function (callback) {
          callback(null, {
            body: [{
              "createdAt": new Date(1461291492076),
              "updatedAt": new Date(1461291518558)
            }]}
          );
        }
      });

      homewrokController.getEstimatedTime({
        query: {
          quizId: 1
        }
      }, {
        send: (data) => {
          expect(data.estimatedTime).toBe(26);
          done();
        }
      })
    });

    it('should return null', (done) => {
      spyOn(userHomeworkQuizzes, 'aggregate').and.returnValue({
        match: function () {
          return this;
        },
        exec: function (callback) {
          callback(null, []);
        }
      });

      homewrokController.getEstimatedTime({
        query: {
          quizId: 1
        }
      }, {
        send: (data) => {
          expect(data.estimatedTime).toBe(null);
          done();
        }
      })
    });

    it('should return null', (done) => {
      spyOn(userHomeworkQuizzes, 'aggregate').and.returnValue({
        match: function () {
          return this;
        },
        exec: function (callback) {
          callback(null, [{
            quizzes: {
              homeworkSubmitPostHistory: [
                '57198861b9eb750600f92eea'
              ]
            }
          }]);
        }
      });

      spyOn(request, 'get').and.returnValue({
        set: function () {
          return this;
        },
        query: function (data) {
          return this;
        },
        end: function (callback) {
          callback(null, {
            body: []
          });
        }
      });

      homewrokController.getEstimatedTime({
        query: {
          quizId: 1
        }
      }, {
        send: (data) => {
          expect(data.estimatedTime).toBe(null);
          done();
        }
      })
    });
  })
});
