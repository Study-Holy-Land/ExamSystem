import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Summary from './summary';
import Timer from './timer';
import QuizList from './quiz-list';
import SubmitButton from './submit-button';
import getQueryString from '../../../../tools/getQueryString';

const quizId = getQueryString('quizId');
class SectionInfo extends Component {
  constructor (props) {
    super(props);
    this.state = {
      section: '',
      quizList: [],
      basicQuiz: [],
      timeToSubmit: false
    };
  }

  componentWillReceiveProps (next) {
    if (next.basicQuiz) {
      this.setState({basicQuiz: next.basicQuiz});
    }

    next.paperInfo.sections.forEach((section) => {
      let quiz = section.quizzes.find(({_id}) => {
        return _id === quizId;
      });
      if (quiz) {
        this.setState({section});
      }
    });
  }
  timeOver (isTimeOver) {
    this.setState({timeToSubmit: isTimeOver});
  }

  render () {
    const submitClassStr = this.state.section.type === 'HomeworkQuiz' ? 'no-display' : '';
    return (
      <div className='flex-box'>
        <div className='section-header'>
          <Summary section={this.state.section} />
          <Timer onTimeOver={this.timeOver.bind(this)} section={this.state.section} />
        </div>
        <div className='section-quizzes'>
          <QuizList section={this.state.section} />
        </div>
        <div className={'section-submit ' + submitClassStr}>
          <SubmitButton showTimeOverModal={this.state.timeToSubmit} section={this.state.section}
              basicQuiz={this.state.basicQuiz}
          />
        </div>
      </div>
    );
  }
}

SectionInfo.propTypes = {
  basicQuiz: PropTypes.array.isRequired,
  paperInfo: PropTypes.object.isRequired
};

const mapStateToProps = ({quiz}) => {
  return {
    paperInfo: quiz.paperInfo,
    basicQuiz: quiz.basicQuiz
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionInfo);
