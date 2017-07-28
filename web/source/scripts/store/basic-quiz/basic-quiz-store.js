var superagent = require('superagent');
var Reflux = require('reflux');
var constant = require('../../../../mixin/constant');
var page = require('page');
var errorHandler = require('../../../../tools/error-handler.jsx');

var BasicQuizActions = require('../../actions/basic-quiz/basic-quiz-actions');
var getQueryString = require('../../../../tools/getQueryString');
var programId = getQueryString('programId');
var paperId = getQueryString('paperId');
var sectionId = getQueryString('sectionId');

var BasicQuizStore = Reflux.createStore({
  listenables: [BasicQuizActions],

  onInit: function () {
    superagent
      .get(`${API_PREFIX}programs/${programId}/papers/${paperId}/sections/${sectionId}`)
      .end((err, res) => {
        if (err) {
          throw (err);
        }
        const quizzes = res.body.section.quizzes.map((quiz) => {
          return Object.assign({}, quiz, {userAnswer: ''});
        });
        this.trigger({
          quizzes,
          sectionId,
          paperId: res.body.paperId,
          programId: res.body.programId
        });
      });
  },
  onSubmitAnswer ({quizzes, programId, paperId}) {
    superagent
      .post(`${API_PREFIX}quiz/section/${sectionId}/submission`)
      .set('Content_Type', 'application/json')
      .send(quizzes)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw (err);
        }
        if (res.statusCode === constant.httpCode.CREATED) {
          page('dashboard.html?programId=' + programId + '&paperId=' + paperId);
        }
      });
  }
});

module.exports = BasicQuizStore;
