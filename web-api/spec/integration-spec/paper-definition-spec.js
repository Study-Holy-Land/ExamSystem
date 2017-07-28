require('./spec-base');
var userSession = global.userSession;
var adminSession = global.adminSession;

describe('POST paper-definitions', ()=> {
  it('should be return a paperId', (done)=> {
    userSession
      .post('/paper-definitions')
      .send({
        data: {
          programId: 1,
          isDistribution: false,

          description: '这是一个描述',
          paperName: '题目',
          sections: [
            {
              title: 'logicQuizzes',
              quizzes: {
                easy: 1,
                normal: 1,
                hard: 1
              },
              type: 'loginQuiz'
            }, {
              title: 'homeworkQuizzes',
              quizzes: [
                {id: 1, uri: '/homeworkQuizzes/1'}, {id: 2, uri: '/homeworkQuizzes/2'}
              ],
              type: 'homeworkQuiz'
            }
          ]
        }
      })
      .expect(201)
      .end(done);
  })
});

describe('GET paper-definitions/:paperId', ()=> {
  it('should be return a paper: GET  paper-definitions/:paperId', (done)=> {
    userSession
      .get('/paper-definitions/5829958a7007c23870a1d68a')
      .expect(200)
      .expect(function (res) {
        res.body.programId.should.equal(1);
        res.body.sections[0].title.should.equal("逻辑题");
        res.body.sections[1].title.should.equal("编程题");
      })
      .end(done);
  })
});

describe('PUT paper-definitions/:id', ()=> {
  it('should be return a paperId', (done)=> {
    userSession
      .put('/paper-definitions/5829958a7007c23870a1d68a')
      .send({
        data: {
          programId: 1,
          paperName: "new title",
          description: "update paper-api",
          sections: [
            {
              title: "logicQuizzes",
              quizzes: {
                easy: 1,
                normal: 1,
                hard: 1
              },
              type: 'loginQuiz'
            }, {
              title: "homeworkQuizzes",
              quizzes: [{id: 1, uri: '/homeworkQuizzes/1'}, {id: 2, uri: '/homeworkQuizzes/2'}],
              type: 'homeworkQUiz'
            }
          ]
        }
      })
      .expect(204)
      .end(done);
  })
});

describe('POST paper-definitions', ()=> {
  it('should be return a paperId', (done)=> {
    userSession
      .post('/paper-definitions')
      .send({
        data: {
          programId: 1,
          isDistribution: false,
          description: '这是一个描述',
          paperName: '题目',
          sections: [
            {
              title: 'logicQuizzes',
              quizzes: {
                easy: 1,
                normal: 1,
                hard: 1
              },
              type: 'loginQuiz'
            }, {
              title: 'homeworkQuizzes',
              quizzes: [
                {id: 1, uri: '/homeworkQuizzes/1'}, {id: 2, uri: '/homeworkQuizzes/2'}
              ],
              type: 'homeworkQuiz'
            }
          ]
        }
      })
      .expect(201)
      .end(done);
  })
});

describe("GET /paper-definitions", ()=> {
  it('should be return paper list', (done)=> {
    userSession
      .get('/paper-definitions')
      .query({
        page: 1,
        pageCount: 10
      })
      .expect(200)
      .expect((res)=> {
        res.body.data.length.should.equal(10);
      })
      .end(done)
  })
});
describe('DELETE paper-definitions/:id', ()=> {
  it('should be return a httpCode', (done)=> {
    userSession
      .delete('/paper-definitions/5829958a7007c23870a1d68a')
      .expect(204)
      .end(done);
  })
});

describe("GET programs/:programId/paperDefinitions/selection", ()=> {
  it('should be return paper list as select type', (done)=> {
    adminSession
      .get('/programs/1/paperDefinitions/selection')
      .query({
        title: 'java',
        page: 1,
        pageCount: 2
      })
      .expect(200)
      .expect((res)=> {
        res.body.data.length.should.equal(2);
      })
      .end(done)
  })
});

describe("Delete /paper-definitions/deletion", ()=> {
  it("should return the paper delete msg", (done)=> {
    adminSession
      .delete('/paper-definitions/deletion')
      .send({
        idArray: ["5829958a7007c23870a1d681", "5829958a7007c23870a1d680"]
      })
      .expect(204)
      .end(done)
  })
});

