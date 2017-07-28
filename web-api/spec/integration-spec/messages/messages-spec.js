require('../spec-base');
require('should');
var userSession = global.userSession;

describe("POST /messages", ()=> {
  it('should be return 201: POST /messages', function (done) {
    userSession
      .post("/messages")
      .send({
        to: 1,
        deeplink: "papers/1/sections/1/homeworks/1",
        type: "requestAnswer"
      })
      .expect(201)
      .expect((res) => {
        res.body.uri.should.match(/^messages\/.{24}/)
      })
      .end(done)

  });
});
