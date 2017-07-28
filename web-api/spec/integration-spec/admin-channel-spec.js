require('./spec-base');
var userSession = global.userSession;
var adminSession = global.adminSession;
require('should');

function isEmptyObject(O){
  for (var x in O){
    return false;
  }
  return true;
}

describe("GET /admin/channel", ()=> {

  it.skip('should be return 403: GET /admin/channel', function(done) {
    userSession
        .get("/admin/channel")
        .expect(403)
        .end(done);
  });

  it('should be return channels: GET /admin/channel', function(done) {
    adminSession
        .get("/admin/channel")
        .expect(200)
        .expect(function(res){
          res.body.links[0].name.should.equal('阿拉啦阿拉拉啦宣讲会');
          res.body.links[1].name.should.equal('哦呵呵哦呵呵呵宣讲会');
        })
        .end(done);
  })
});

describe("POST /admin/channel", ()=> {

  it('should post new channel: POST /admin/channel', function(done) {
    adminSession
        .post("/admin/channel")
        .send({name:'cooooooooool'})
        .expect(200)
        .expect(function(res){
          isEmptyObject(res.body).should.equal(true);
        })
        .end(done);
  });

  it('should not success when post same channel: POST /admin/channel', function(done) {
    adminSession
        .post("/admin/channel")
        .send({name:'哦呵呵哦呵呵呵宣讲会'})
        .expect(200)
        .expect(function(res){
          res.body.message.should.equal('Already Exist');
        })
        .end(done);
  });

});

describe("DELETE /admin/channel", ()=> {

  it('should delete a channel: DELETE /admin/channel', function(done) {
    adminSession
        .del("/admin/channel")
        .query({name:'阿拉啦阿拉拉啦宣讲会',_id:'571db954d7a1e0c11ea7302e'})
        .expect(200)
        .end(done);
  });
});


