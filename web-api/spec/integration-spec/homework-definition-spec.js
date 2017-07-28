"use strict";

require('./spec-base');
var userSession = global.userSession;

describe("GET MATCHED homeworkDefinitions", ()=> {
  it("should return matched homeworkDefinitions list", (done)=> {
    userSession
        .get('/homework-definitions/selection')
        .query({
          page: 1,
          pageCount: 1,
          name: "juanz1"
        })
        .expect(200)
        .expect((res) => {
          res.body.data.length.should.equal(1);
        })
        .end(done)
  })
});

describe("GET homeworkDefinitions", ()=> {
  it('should be return homeworkDefinitions list', (done)=> {
    userSession
        .get('/homework-definitions')
        .query({
          page: 1,
          pageCount: 5,
          order: 1,
          sort: 'createTime'
        })
        .expect(200)
        .expect((res)=> {
          res.body.data.length.should.equal(5);
        })
        .end(done)
  })
});

describe("GET homeworkDefinitions/:homeworkId", ()=> {
  it("should return one homework", (done)=> {
    userSession
        .get('/homework-definitions/5829958a7007c23870a1d680')
        .expect(200)
        .end(done)
  })
});

describe("DELETE homeworkDefinitions/:homeworkId", ()=> {
  it("should return success or fail of deleteHomework", (done)=> {
    userSession
        .delete('/homework-definitions/5829958a7007c23870a1d680')
        .expect(204)
        .end(done)
  })
});

describe("Delete /homeworkDefinitions/deletion", ()=> {
  it("should return the delete msg", (done)=> {
    userSession
        .delete('/homework-definitions/deletion')
        .send({
          idArray: ["5829958a7007c23870a1d681", "5829958a7007c23870a1d680"]
        })
        .expect(204)
        .end(done)
  })
});
