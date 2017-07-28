require('./spec-base');
var userSession = global.userSession;

describe("GET /paper/:paperHash", ()=> {

  it('should be return sections: GET paper/5721c15b146722168ff9941e', function(done) {
    userSession
      .get("/papers/5721c15b146722168ff9941e")
      .expect(200)
      .end(done);
  })
});
