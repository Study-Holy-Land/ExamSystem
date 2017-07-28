require('./spec-base');
var adminSession = global.adminSession;
require('should');

describe("GET /admin/registerable", ()=> {

  it('should be return registerable status: GET /admin/registerable', function(done) {
    adminSession
        .get("/admin/registerable")
        .expect(200)
        .expect(function(res){
          res.body.configuration.registerable.should.equal(true);
        })
        .end(done);
  })

});


describe("POST /admin/registerable", ()=> {

  it('should be change registerable status: POST /admin/registerable', function(done) {
    adminSession
        .post("/admin/registerable")
        .send({value:false})
        .expect(200)
        .expect(function(res){
          res.body.configuration.registerable.should.equal(false);
        })
        .end(done);
  })

});