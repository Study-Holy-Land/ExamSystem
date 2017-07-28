'use strict';

require('./libs/outdatedBrowserCheck');
require('../less/homework.less');
require('../less/get-account.less');

var outdatedBrowserRework = require("outdated-browser-rework");
require("./libs/outdatedbrowser.min.css");
outdatedBrowserRework({
  browserSupport: {
    'Chrome': 48, // Includes Chrome for mobile devices
    'IE': 11,
    'Safari': 7,
    'Mobile Safari': 7,
    'Firefox': 32
  }
});

var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');
var HomeworkSidebar = require('./component/homework/homework-sidebar.component.jsx');
var HomeworkContent = require('./component/homework/homework-content.component.jsx');
var HomeworkIntroduction = require('./component/homework/homework-introduction.component.jsx');
var SubmissionIntroduction = require('./component/homework/submission-introduction.component.jsx');
var RunningResult = require('./component/homework/running-result.component.jsx');
var RequestAnswer = require('./component/homework/homework-request-answer.component.jsx');

var constant = require('../../mixin/constant');
var Reflux = require('reflux');
var HomeworkAction = require('./actions/homework/homework-actions');
var HomeworkStore = require('./store/homework/homework-store.js');
var getQueryString = require('../../tools/getQueryString');

var Homework = React.createClass({
  mixins: [Reflux.connect(HomeworkStore)],

  getInitialState: function () {
    return {
      homeworkQuizzes: [],
      orderId: 1,
      currentQuiz: {},
      currentAnswer: ""
    };
  },

  handleOrderIdChange: function (_orderId) {
    this.setState({
      orderId: _orderId
    });
    history.pushState(null, '', '#' + _orderId);
    HomeworkAction.changeOrderId(_orderId);
  },

  componentDidUpdate: function () {
    var _orderId = parseInt(location.hash.substr(1));
    if (this.state.orderId !== _orderId) {
      history.pushState(null, '', '#' + this.state.orderId);
    }
  },

  componentDidMount: function () {
    var programId = getQueryString('programId');
    var paperId = getQueryString('paperId');
    var sectionId = getQueryString('sectionId');
    var questionId = getQueryString('questionId');
    HomeworkAction.init(questionId);
  },

  handleRepoUpdate: function (newRepo) {
    this.state.currentQuiz.userAnswerRepo = newRepo;
    this.setState({
      "currentQuiz": this.state.currentQuiz
    });
  },

  handleBranchUpdate: function (newBranch) {
    this.state.currentQuiz.branch = newBranch;
    this.setState({
      "currentQuiz": this.state.currentQuiz
    });
  },

  render: function () {
    const ids = Object.assign({}, this.state.currentQuiz.info);
    return (
      <div>
        <header>
          <Navigation>
            <Account />
          </Navigation>
        </header>
        <div>
          <HomeworkSidebar
            homeworkQuizzes={this.state.homeworkQuizzes}
            onOrderIdChange={this.handleOrderIdChange}
            orderId={this.state.orderId} ids={ids}/>


          <HomeworkContent
            orderId={this.state.orderId}
            quiz={this.state.currentQuiz}>

            <HomeworkIntroduction
              quiz={this.state.currentQuiz}/>

            <SubmissionIntroduction
              quiz={this.state.currentQuiz}
              orderId={this.state.orderId}
              onRepoUpdate={this.handleRepoUpdate}
              onBranchUpdate={this.handleBranchUpdate}
              startProgress={this.pollData}/>

            <RunningResult
              quiz={this.state.currentQuiz}/>

            <RequestAnswer questionId={getQueryString('questionId')}
                           sectionId={getQueryString('sectionId')}
                           paperId={getQueryString('paperId')}
                           answer={this.state.currentAnswer}
                           homeworkQuizzes={this.state.homeworkQuizzes}
                           orderId={this.state.orderId}
            />
          </HomeworkContent>
        </div>
      </div>
    );
  }
});

ReactDom.render(<Homework />, document.getElementById('homework'));
