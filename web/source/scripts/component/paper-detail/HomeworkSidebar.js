import {Component} from 'react';
import {connect} from 'react-redux';
import superAgent from 'superagent';
import noCache from 'superagent-no-cache';
import errorHandler from '../../../../tools/error-handler.jsx';
import constant from '../../../../mixin/constant';
import moment from '../../../../tools/init-moment';

class HomeworkSidebar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      sectionId: '',
      sectionLimit: '',
      orderId: 1
    };
  }

  componentDidMount () {
    const sectionId = this.props.section.sectionId;
    this.getSectionLimit(sectionId);
  }

  componentWillReceiveProps (next) {
    const sectionId = next.section.sectionId;
    if (next.questions.length && this.state.orderId === 1) {
      this.props.editPaper({activeQuestion: next.questions[0]});
    }
    this.getSectionLimit(sectionId);
  }

  handleClick (orderId, question) {
    if (orderId !== this.state.orderId) {
      this.setState({orderId: orderId});
      this.props.editPaper({activeQuestion: question});
    }
  }

  getSectionLimit (sectionId) {
    superAgent.get(`${API_PREFIX}timer/initSection/${sectionId}`)
        .set('Content-Type', 'application/json')
        .use(noCache)
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            throw err;
          } else {
            const startTime = parseInt(res.body.startTime) * constant.time.MILLISECOND_PER_SECONDS;
            const startDay = moment(startTime);
            const sevenDayTime = 7 * constant.time.HOURS_PER_DAY *
                constant.time.MINUTE_PER_HOUR *
                constant.time.SECONDS_PER_MINUTE *
                constant.time.MILLISECOND_PER_SECONDS;
            const endDay = moment(startTime + sevenDayTime);

            this.setState({sectionLimit: `${startDay}--${endDay}`});
          }
        });
  }

  render () {
    const questions = this.props.questions ? this.props.questions : [];
    const questionList = questions.map((question, index) => {
      const orderId = index + 1;
      return (<button className='quiz-number' key={index} onClick={this.handleClick.bind(this, orderId, question)}>
        <div>{question.homeworkName}</div>
      </button>);
    });

    return (
        <div>
          <div className='section-header'>
            <div className='section-title'>编程题</div>
            <div className='section-description'>{this.state.sectionLimit}</div>
          </div>
          <div className='section-quizzes'>{questionList}</div>

          <div className='section-submit'>
            <button className='logic-submit'>提交试卷</button>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({paperDetail}) => {
  return {
    section: paperDetail.activeSection,
    questions: paperDetail.questions
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkSidebar);
