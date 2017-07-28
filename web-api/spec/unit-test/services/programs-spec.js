require('should');
var SectionService = require('../../../services/section-service');
require('../base');
var logicPuzzle = require('../../../models/logic-puzzle');
var userHomeworkQuizzes = require('../../../models/user-homework-quizzes');


describe('SectionService', () => {

  let sectionSrv;

  beforeEach(() => {
    sectionSrv = new SectionService();
  });

  it('getList() should return section list', function (done) {
    sectionSrv.getList({userId: 1, programId: 1, paperId: 1}, (err, data) => {
      done();
    })
  });
});

