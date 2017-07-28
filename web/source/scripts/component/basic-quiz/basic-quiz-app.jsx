require('../../../less/basic-quiz.less');
var Reflux = require('reflux');
var BasicQuizActions = require('../../actions/basic-quiz/basic-quiz-actions');
var BasicQuizStore = require('../../store/basic-quiz/basic-quiz-store');
var BasicQuizLeft = require('./basic-quiz-left.component.jsx');
var BasicQuizSidebar = require('./basic-quiz-sidebar.component.jsx');

var BasicQuizApp = React.createClass({
  mixins: [Reflux.connect(BasicQuizStore)],

  componentDidMount: function () {
    BasicQuizActions.init();
  },

  onUpdateAnswer({index, userAnswer}){
    const newQuiz = Object.assign({}, this.state.quizzes[index], {userAnswer});
    this.state.quizzes[index] = newQuiz;
  },

  render(){
    return (
      <div className="container-fluid">
        <div className="col-md-9 col-sm-8 basic-quiz-border">
          <BasicQuizLeft quizzes={this.state.quizzes}
                         onUpdateAnswer={this.onUpdateAnswer}/>
        </div>

        <div className="col-md-3 col-sm-4">
          <BasicQuizSidebar sectionId={this.state.sectionId}
                            paperId={this.state.paperId}
                            programId={this.state.programId}
                            quizzes={this.state.quizzes}/>
        </div>
      </div>
    );
  }
});

module.exports = BasicQuizApp;
