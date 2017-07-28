var Reflux = require('reflux');
var PaperListAction = require('../../actions/paper-list/paper-list');
var request = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');
var async = require('async');
var page = require('page');
var superAgent = require('superagent');

var PapersListStore = Reflux.createStore({
  listenables: [PaperListAction],

  onLoadPapers: function () {
    async.waterfall([
      (done) => {
        superAgent.get(API_PREFIX + 'test/detail')
          .set('Content-Type', 'application/json')
          .end(function (err, resp) {
            if (resp && resp.body.data === false) {
              page('user-center.html#userDetail');
            }
            done(err, resp);
          });
      },
      (resp, done) => {
        request.get(API_PREFIX + 'user/programs')
          .set('Content-Type', 'application/json')
          .use(errorHandler)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            const programs = res.body;
            done(null, programs);
          });
      },
      (data, done) => {
        async.map(data, ({programId, programName, programType, orderEnable}, callback) => {
          request.get(`${API_PREFIX}programs/${programId}/papers`)
            .set('Content-Type', 'application/json')
            .use(errorHandler)
            .end((err, resp) => {
              callback(err, {data: resp.body.data, programId, programName, programType, orderEnable});
            });
        }, done);
      },
      (result, done) => {
        async.map(result, (program, cb) => {
          this.mapProgramMsg(program, cb);
        }, done);
      }], (err, result) => {
      if (err) {
        throw err;
      }

      return this.trigger({papers: result, isClickedArray: this.getPaperClickStatus(result)});
    });
  },

  mapProgramMsg (program, cb) {
    async.map(program.data, (paper, callback) => {
      async.waterfall([
        (done) => {
          request.post(`${API_PREFIX}programs/${program.programId}/papers/${paper.id}`)
            .end((err, res) => {
              done(err, res.body.data.id);
            });
        },
        (id, done) => {
          request.get(`${API_PREFIX}programs/${program.programId}/papers/${id}/sections`)
            .end((err, res) => {
              if (err) {
                throw err;
              }
              this.getPaperStatus(res.body.data, (err, data) => {
                const paperRate = this.getPaperRate(res.body.data);
                paperRate.currentQuizId = this.getCurrentQuizId(res.body.data);
                done(err, Object.assign({}, paper, data, paperRate));
              });
            });
        }
      ], callback);
    }, (err, papers) => {
      cb(err, Object.assign({}, program, {data: papers}));
    });
  },

  getPaperClickStatus: function (papers) {
    let clickedArray = [];

    papers.forEach((program, index) => {
      program.data.forEach(paper => {
        if (paper.status === 0) {
          clickedArray[index] = paper.id;
        }
      });
      program.data.forEach(paper => {
        if (paper.status === 2 && !clickedArray[index]) {
          clickedArray[index] = paper.id;
        }
      });
    });

    return clickedArray;
  },

  getCurrentQuizId: function (sections) {
    let currentQuizId = sections[0].firstQuizId;
    let activeSection = sections.find(section => section.status === 0);
    if (activeSection) {
      currentQuizId = activeSection.firstQuizId;
    }

    return currentQuizId;
  },

  getPaperRate: function (papers) {
    const totalSection = papers.length;
    const finishedSection = papers.filter(paper => paper.status === 1).length;
    const rate = parseInt(finishedSection / totalSection * 100);

    return {totalSection, rate, finishedSection};
  },

  getPaperStatus: function (sections, callback) {
    const obj = [false, sections[sections.length - 1].status === 1, sections.every(section => (section.status === 3))];

    let status = 0;
    obj.forEach((item, index) => {
      if (item) {
        status = index;
      }
    });
    return callback(null, {status});
  },

  onGetOnePaper: function (id, programId, currentQuizId) {
    request.post(`${API_PREFIX}programs/${programId}/papers/${id}`)
      .end((err, res) => {
        if (err) {
          return;
        }
        if (res.statusCode === 200) {
          page('quiz.html?&quizId=' + currentQuizId);
          // page('dashboard.html?programId=' + programId + '&paperId=' + res.body.data.id);
        }
      });
  }
});

module.exports = PapersListStore;
