import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import page from 'page';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import errorHandler from '../../../../tools/error-handler.jsx';
import getQueryString from '../../../../tools/getQueryString';

const quizId = getQueryString('quizId');
class QuizList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quizList: []
    };
  }

  componentWillReceiveProps (next) {
    if (next.section.type === 'BasicQuiz') {
      this.setState({quizList: []});
    } else {
      this.setState({quizList: next.section.quizzes});
    }
  }

  handleClick (nextQuizId) {
    if (this.props.section.type === 'LogicPuzzle') {
      superagent.post(`${API_PREFIX}quiz/${quizId}/submission`)
        .send({userAnswer: this.props.userAnswer})
        .use(noCache)
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          if (res.statusCode === 200) {
            page('quiz.html?&quizId=' + nextQuizId);
          }
        });
    } else {
      page('quiz.html?&quizId=' + nextQuizId);
    }
  }

  render () {
    const quizzes = this.state.quizList.length ? this.state.quizList.map(({_id}, index) => {
      let classStr = 'quiz-number ' + (_id === quizId ? 'selected' : '');
      return (<button className={classStr} onClick={this.handleClick.bind(this, _id)} key={index}>
        <div>题目{index + 1}</div>
      </button>);
    }) : [];
    return (
      <div>
        {quizzes}
      </div>
    );
  }
}

QuizList.propTypes = {
  userAnswer: PropTypes.string.isRequired
};

const mapStateToProps = ({quiz}) => {
  return {
    userAnswer: quiz.userAnswer
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizList);
