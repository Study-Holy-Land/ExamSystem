import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import SuperAgent from 'superagent';
import noCache from 'superagent-no-cache';
import getQueryString from '../../../../../tools/getQueryString';
import BasicBlankQuiz from './basic-blank-quiz';
import SingleChoice from './basic-single-choice';
import MultipleChoice from './basic-multiple-choice';
require('../../../../less/basic-quiz.less');
const quizId = getQueryString('quizId');

const BasicQuizzes = {
  'BASIC_BLANK_QUIZ': BasicBlankQuiz,
  'SINGLE_CHOICE': SingleChoice,
  'MULTIPLE_CHOICE': MultipleChoice
};

class BasicQuiz extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quizzes: []
    };
  }

  componentDidMount () {
    SuperAgent.get(`${API_PREFIX}quiz/${quizId}/quizzes`)
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        const quizzes = res.body.quizzes.map((quiz) => {
          return Object.assign({}, quiz, {userAnswer: ''});
        });
        this.setState({quizzes});
      });
  }

  onUpdateAnswer ({index, userAnswer}) {
    const newQuiz = Object.assign({}, this.state.quizzes[index], {userAnswer});
    let quizzes = this.state.quizzes;
    quizzes[index] = newQuiz;
    quizzes[index].submits.push(userAnswer);
    this.setState({quizzes}, () => {
      this.props.editPaper({basicQuiz: this.state.quizzes});
    });
  }

  render () {
    let quizzes = this.state.quizzes || [];

    return (
      <div className='basic-quiz'>
        <div className='col-md-9 col-sm-9 basic-quiz-border'>
          <div className='quiz-item'>
            {
              quizzes.map(({quizId, submits}, index) => {
                const Quiz = BasicQuizzes[quizId.type];
                const userAnswer = submits[submits.length - 1];
                return (
                  <Quiz
                      key={index}
                      {...quizId}
                      quizzes={quizzes}
                      userAnswer={userAnswer}
                      index={index}
                      onUpdateAnswer={this.onUpdateAnswer.bind(this)}
                      disabled={this.props.disabled}
                  />
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

BasicQuiz.propTypes = {
  editPaper: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicQuiz);

