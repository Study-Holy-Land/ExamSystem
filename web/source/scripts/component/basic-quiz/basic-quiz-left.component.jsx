var BasicBlankQuiz = require('./basic-blank-quiz.component.jsx');
var SingleChoice = require('./single-choice.component.jsx');
var MultipleChoice = require('./multiple-choice.component.jsx');

const BasicQuiz = {
  'BASIC_BLANK_QUIZ': BasicBlankQuiz,
  'SINGLE_CHOICE': SingleChoice,
  'MULTIPLE_CHOICE': MultipleChoice
};

var BasicQuizLeft = React.createClass({

  render(){
    let quizzes = this.props.quizzes || [];
    return (
      <div>
        {
          quizzes.map(({quizId}, index) => {
            let Quiz = BasicQuiz[quizId.type];
            return (
              <Quiz key={index} {...quizId} quizzes={this.props.quizzes}
                    index={index} onUpdateAnswer={this.props.onUpdateAnswer}/>
            )
          })
        }
      </div>
    );
  }
});

module.exports = BasicQuizLeft;
