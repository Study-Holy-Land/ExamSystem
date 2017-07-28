require('./spec-base');
var userSession = global.userSession;

describe("GET /paper-draft", ()=> {
  it('should be return 200 and paper-draft list: GET /paper-draft', function (done) {
    userSession
        .get("/paper-draft")
        .expect(200)
        .expect(function(res){
          res.body[0].paperName.should.equal('java 基础测验');
          res.body[0].isPublished.should.equal(true);
          res.body[0].groupId.should.equal(1);
          res.body[0].groupHashId.should.equal('57231289d46aebaca22c08fe');
          res.body[0].makerId.should.equal(2);
          res.body[0].updateTime.should.equal(1462764146);
          res.body[0].createTime.should.equal(1462764060);
          res.body[0].homeworkSections.length.should.equal(1);
          res.body[0].logicPuzzleSections.length.should.equal(1);
        })
        .end(done);
  });
});

describe("POST /paper-draft", ()=> {
  it('should be return 200: POST /paper-draft', function(done) {
    userSession
    .post("/paper-draft")
    .expect(200)
    .send({
      isPublished: false,
      paperName: 'html 基础测验',
      groupHashId: '57231289d46aebaca22c98fe',
      groupId: 1
    })
    .end(done);
  });
});

describe("POST /paper-draft/57303a24aae48e0e65cd8db7/logicPuzzleSections", ()=> {
  it('should be return 200: POST /paper-draft/57303a24aae48e0e65cd8db7/logicPuzzleSections', function(done) {
    userSession
    .post("/paper-draft/57303a24aae48e0e65cd8db7/logicPuzzleSections")
    .expect(200)
    .send({
      easyCount: 4,
      normalCount: 5,
      hardCount: 7
    })
    .end(done);
  });
});

describe("POST /paper-draft/57303a24aae48e0e65cd8db7/homeworkSections", ()=> {
  it('should be return 200: POST /paper-draft/57303a24aae48e0e65cd8db7/homeworkSections', function (done) {
    userSession
    .post("/paper-draft/57303a24aae48e0e65cd8db7/homeworkSections")
    .expect(200)
    .send({
      definitionRepo: 'https://github.com/lilili/pos.v_3',
      branch: 'master',
      templateRepo: 'https: //github.com/lilili/pos.v_3_template',
      descriptionAddress: 'https: //github.com/lilili/pos.v_3/blob/master/description.md',
      inspectionAddress: 'https: //github.com/lilili/pos.v_3/blob/master/inspection.sh'
    })
    .end(done)
  });
});