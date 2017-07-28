require('./spec-base');
var adminSession = global.adminSession;

describe("PUT /group/:groupHash", ()=> {
  // TODO：未完成的功能，需要跟老师商量
  it('should be return 201: POST /group', function (done) {
    adminSession
      .post("/group")
      .send({
        "name": "twars",
        "avatar": "",
        "isAnnouncePublished": true,
        "announcement": "fffffff"
      })
      .expect(200)
      .end(done)
  });
  
  it('should be return 200: PUT /group/:groupHash', function (done) {
    adminSession
      .put("/group/57287ba8c3397e53c404f3a9")
      .send({
        "name": "twars",
        "avatar": "",
        "isAnnouncePublished": true,
        "announcement": "fffffff"
      })
      .expect(200)
      .expect(function (res) {
        res.body.status.should.equal(200)
      })
      .end(done)
  });
});