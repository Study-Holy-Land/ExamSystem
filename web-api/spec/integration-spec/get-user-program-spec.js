require('./spec-base');
var userSession = global.userSession;

describe('/user/programs', ()=> {
  it(' GET /user/programs should return programIds', (done)=> {
    userSession
      .get('/user/programs')
      .expect(200)
      .expect((res)=> {
        res.body.length.should.equal(1)
      })
      .end(done)
  });
});