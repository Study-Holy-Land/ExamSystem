'use strict';

var LogicPuzzleController = require('../../controllers/logic-puzzle-controller');
var logicPuzzle = require('../../models/logic-puzzle');
var apiRequest = require('../../services/api-request');
var constant = require('../../mixin/constant');

describe('LogicPuzzleController', function () {

  var controller;
  var quiz;
  var doc;

  beforeEach(function () {
    controller = new LogicPuzzleController();
    quiz = null;
    doc = null;

  });

  describe('getLogicPuzzle', function () {

    it('should_return_quiz_item_by_order_index', function (done) {

      spyOn(logicPuzzle, 'getLogicPuzzle').and.callFake(function (orderId, userId) {

        return {
          then: function (fn) {
            setTimeout(function () {
              fn({data: 123});
            }, constant.time.MILLISECOND_PER_SECONDS);
          }
        };
      });

      controller.getLogicPuzzle({
        query: {orderId: 1},
        session: {
          user: {id: 3}
        }
      }, {
        send: function (data) {
          expect(data).toEqual({
            data: 123
          });
          done();
        }
      });

    });

  });

  describe('saveAnswer', function () {

    it('should save user answer successfully when it is not example', function (done) {

      spyOn(logicPuzzle, 'findOne').and.callFake(function (id, done) {
        done(null, {
          save: function (done) {
            quiz = this.quizItems;
            done(null, quiz);
          },
          quizExamples: ['1', '2', '3'],
          quizItems: [{userAnswer: '1'}, {userAnswer: '2'}, {userAnswer: '3'}, {userAnswer: '4'}, {userAnswer: '5'}]
        });
      });

      controller.saveAnswer({
        body: {
          orderId: 4, userAnswer: '1'
        },
        session: {
          user: {
            id: 1
          }
        }
      },
        {
          sendStatus: function (data) {
            expect(data).toEqual(constant.httpCode.OK);
            expect(quiz[1].userAnswer).toEqual('1');
            done();
          }
        });
    });

    it('should ignore when it is example', function (done) {

      spyOn(logicPuzzle, 'findOne').and.callFake(function (id, done) {
        done(null, {
          save: function (done) {
            quiz = this.quizItems;
            done(null, quiz);
          },
          quizExamples: ['1', '2', '3'],
          quizItems: [{userAnswer: '1'}, {userAnswer: '2'}, {userAnswer: '3'}, {userAnswer: '4'}, {userAnswer: '5'}]
        });
      });

      controller.saveAnswer({
        body: {
          orderId: 0, userAnswer: '1'
        },
        session: {
          user: {
            id: 1
          }
        }
      }, {
        sendStatus: function (data) {
          expect(data).toEqual(constant.httpCode.OK);
          expect(quiz).toEqual(null);
          done();
        }
      });
    });

    it('should return server error when it\'s error', function (done) {

      spyOn(logicPuzzle, 'findOne').and.callFake(function (id, done) {
        done('oooooops!', {});
      });

      controller.saveAnswer({body: {orderId: 4, userAnswer: '1'}, session: {user: {id: 1}}},
        {
          sendStatus: function (data) {
            expect(data).toEqual(constant.httpCode.INTERNAL_SERVER_ERROR);
            done();
          }
        });
    });

  });

  describe('submitPaper', function () {

    it('should submit paper and return success info', function (done) {
      spyOn(logicPuzzle, 'findOne').and.callFake(function (id, done) {
        done(null, {
          save: function (done) {
            doc = this;
            done(null, 'data');
          },
          paperId: 1,
          blankQuizId: 1,
          quizItems: [{id: 3, userAnswer: '10'}]
        });
      });

      spyOn(LogicPuzzleController, 'setScoreSheet').and.callFake(function (data, done) {
        done(null, 'OK!');
      });


      controller.submitPaper({session: {user: {id: 1}}},
        {
          sendStatus: function (data) {
            expect(data).toEqual(constant.httpCode.OK);
            expect(doc.isCommited).toEqual(true);
            done();
          }
        });
    });

    it('can\'t find the userPuzzle when submit paper ', function (done) {
      spyOn(logicPuzzle, 'findOne').and.callFake(function (id, done) {
        done('error', {});
      });

      spyOn(LogicPuzzleController, 'setScoreSheet').and.callFake(function (data, done) {
        done(null, 'OK!');
      });

      controller.submitPaper({session: {user: {id: 1}}},
        {
          sendStatus: function (data) {
            expect(data).toEqual(constant.httpCode.INTERNAL_SERVER_ERROR);
            done();
          }
        });
    });
  });
});