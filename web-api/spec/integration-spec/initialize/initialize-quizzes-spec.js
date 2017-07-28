require('../spec-base');
var userSession = global.userSession;

describe('/user/feedback', ()=> {

  it('Get /user-initialization/initializeQuizzes/:programId/:paperId should return homework detail', (done)=> {
    userSession
        .get('/user-initialization/initializeQuizzes/1/1')
        .expect(200)
        // .expect((res)=> {
        //   console.log(res.body);
        // })
        .end(done)
  });
});