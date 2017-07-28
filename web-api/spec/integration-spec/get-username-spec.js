require('./spec-base');
var userSession = global.userSession;
require('should');

describe("should be return username by id", ()=> {
    it("GET /username", function(done) {
        userSession
            .get('/username')
            .expect(200)
            .expect((res)=> {
                res.body.username.should.equal('章三')
            })
            .end(done)
    })
});


