"use strict";

require('./spec-base');
var userSession = global.userSession;

describe("GET /homeworks", ()=> {
  it("should return mysql homeworkList", (done)=> {
    userSession
      .get('/homeworks')
      .query({
        page: 1,
        pageCount: 3
      })
      .expect(200)
      .expect((res) => {
        res.body.homeworkList.length.should.equal(4)
      })
      .end(done)
  })
});