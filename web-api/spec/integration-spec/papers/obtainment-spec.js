require('../spec-base');

describe('/user/feedback', ()=> {

  it('Get /user/feedback should return homework detail', (done)=> {
    userSession
        .get('/papers/1/obtainment')
        .expect(200)
        // .expect((res)=> {
        //   console.log(res);
        // })
        .end(done)
  });
});