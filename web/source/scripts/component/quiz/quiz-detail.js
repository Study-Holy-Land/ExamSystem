import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LogicPuzzle from './logic-puzzle';
import HomeworkQuiz from './homework-quiz';
import BasicQuiz from './basic-quiz';
import superAgent from 'superagent';
import noCache from 'superagent-no-cache';
import getQueryString from '../../../../tools/getQueryString';

const quizId = getQueryString('quizId');

class QuizDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quizDetail: '',
      section: {},
      programType: ''
    };
  }

  componentDidMount () {
    superAgent.get(`${API_PREFIX}quiz/${quizId}`)
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({
          quizDetail: res.body
        });
      });
  }

  componentWillReceiveProps (next) {
    this.setState({
      programType: next.paperInfo.program.type
    });
    if (next.paperInfo) {
      next.paperInfo.sections.forEach((section) => {
        let quiz = section.quizzes.find(({_id}) => {
          return _id === quizId;
        });
        if (quiz) {
          this.setState({section});
        }
      });
    }
  }

  render () {
    const quizDetail = this.state.quizDetail;
    const programType = this.state.programType;
    const type = quizDetail && quizDetail.info ? quizDetail.info.type : '';
    const quizType = {
      'HomeworkQuiz': <HomeworkQuiz quizDetail={quizDetail} programType={programType} />,
      'LogicPuzzle': <LogicPuzzle quizDetail={quizDetail} section={this.state.section} />,
      'BasicQuiz': <BasicQuiz
          disabled={this.state.section.status === 1 && this.props.paperInfo.program.type === 'practice'}
                   />
    };

    return (
      <div className='quiz'>
        {quizType[type]}
      </div>
    );
  }
}

QuizDetail.propTypes = {
  paperInfo: PropTypes.object.isRequired
};

const mapStateToProps = ({quiz}) => {
  return {
    paperInfo: quiz.paperInfo
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizDetail);
