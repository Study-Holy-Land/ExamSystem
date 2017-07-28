var userSession = global.userSession;


describe('QuestionController', () => {
  it('should return Homework when receive request', (done) => {
    userSession.get('/questions/5866007d7274f8b8a786d2e0')
      .expect(200)
      .expect((res) => {
        res.body.id.should.equal(2)
      })
      .end(done);
  });
  it('should return LogicPuzzle when receive request', (done) => {
    userSession.get('/questions/5866007d7274f8b8a786d2e3')
      .expect(200)
      .expect((res) => {
        res.body.item.id.should.equal(44)
      })
      .end(done);
  });
});