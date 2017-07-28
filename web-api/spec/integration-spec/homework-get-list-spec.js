require('./spec-base');
var userSession = global.userSession;

describe("GET /homework/get-list/:id", ()=> {
  it('should be return 200: GET /homework/get-list/:id', function (done) {
    userSession
        .get("/homework/get-list/5850c8d65ec9ae3f3ca00674")
        .expect(200)
        .expect(function (res) {
          res.body.homeworkQuizzes[0].id.should.equal(1); // modify: 3 -> 1
          res.body.homeworkQuizzes[0].status.should.equal(3);
          res.body.homeworkQuizzes[0].uri.should.equal("homeworkQuizzes/1");
        })
        .end(done)
  });
});
