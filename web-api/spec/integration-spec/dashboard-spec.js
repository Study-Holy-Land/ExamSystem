require('./spec-base');
var userSession = global.userSession;


describe("POST /dashboard/:programId/:paperId", () => {
  it('should be return 200: POST /dashboard/:programId/:paperId', function (done) {
    userSession
      .get("/dashboard/1/1")
      .query({sections: JSON.stringify([
        {
          _id: "584f527cb63ad230d43c5fa1",
          type: "logicQuizzes",
          id: "584f527cb63ad230d43c5fa1"
        },
        {
          _id: "585cab566f396a3c00433ae7",
          type: "homeworkQuizzes",
          id: "585cab566f396a3c00433ae7"
        }])}
      )
      .expect(200)
      .expect(function (res) {
        res.body.isFinishedDetail.should.equal(true);
      })
      .end(done);
  });
});