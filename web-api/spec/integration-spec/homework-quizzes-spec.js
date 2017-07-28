'use strict';

require('./spec-base');
var userSession = global.userSession;

describe('GET /homeworkQuizzes/1', ()=> {
  it("should return the homework name", (done)=> {
    userSession
        .get('/homework-quizzes/1')
        .expect(200)
        .expect((res)=> {
          res.body.homeworkName.should.equal('homework1')
        })
        .end(done)
  })
});