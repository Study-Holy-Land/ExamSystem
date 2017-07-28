'use strict';

require('should');
var async = require('async');
var mongoose = require('mongoose');
var homeworkScoring = require('../../../models/homework-scoring');
var userHomeworkQuizzes = require('../../../models/user-homework-quizzes');

require('../spec-base');
var userSession = global.userSession;

describe('/homework/scoring', ()=> {

  it('Get /homework/quiz/1 should return homework detail', function(done) {
    userSession
        .get('/homework/quizzes/1?paperId=2')
        .expect(200)
        .end(done)
  });
});
