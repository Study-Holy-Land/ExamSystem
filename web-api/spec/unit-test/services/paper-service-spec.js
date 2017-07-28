require('should');
var PaperService = require('../../../services/paper-service');
require('../base');
var logicPuzzle = require('../../../models/logic-puzzle');
var userHomeworkQuizzes = require('../../../models/user-homework-quizzes');


describe('paperSrv', () => {

  let paperSrv;

  beforeEach(() => {
    paperSrv = new PaperService();
  });

  it('retrieve() should return one paper', function (done) {
    paperSrv.retrieve({userId: 1, programId: 1, paperId: 1}, (err, data) => {
      data.id.should.equal('586df703ad622812ec5e7bb3');
      done();
    })
  });

  it('getSection() should return sections status object', function (done) {
    paperSrv.getSection({userId: 1, programId: 1, paperId: 1}, (err, data) => {
      data.length.should.equal(2);
      done();
    })
  });
});


