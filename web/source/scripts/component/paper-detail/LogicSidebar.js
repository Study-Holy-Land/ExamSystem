import {Component} from 'react';
import {connect} from 'react-redux';
import superAgent from 'superagent';
import noCache from 'superagent-no-cache';
import constant from '../../../../mixin/constant';
import getQueryString from '../../../../tools/getQueryString';

const programId = getQueryString('programId');
const paperId = getQueryString('paperId');

class LogicSidebar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      remainTime: '',
      sectionId: '',
      orderId: 1
    };
  }

  componentDidMount () {
    if (this.props.sectionId) {
      this.getRemainTime(programId, paperId, this.props.sectionId);
    }
    this.countDown();
  }

  componentWillReceiveProps (next) {
    if (next.orderId) {
      this.setState({orderId: next.orderId});
    } else if (next.questions.length && this.state.orderId === 1) {
      this.props.editPaper({activeQuestion: next.questions[0]});
    }
  }

  countDown () {
    setInterval(() => {
      if (this.state.remainTime) {
        let remainTime = this.state.remainTime - 1;

        if (remainTime <= 0) {
          remainTime = 0;
        }

        this.setState({
          remainTime: remainTime
        });

        if (remainTime % (constant.time.SECONDS_PER_MINUTE * 2) === 1) {
          this.getRemainTime(programId, paperId, this.state.sectionId);
        }
      }
    }, constant.time.MILLISECOND_PER_SECONDS);
  }

  getRemainTime (programId, paperId, sectionId) {
    superAgent
      .get(API_PREFIX + 'timer/remain-time')
      .query({programId, paperId, sectionId})
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({remainTime: res.body.remainTime});
      });
  }

  handleClick (orderId, questionId) {
    if (orderId !== this.state.orderId) {
      this.setState({orderId: orderId});
      this.props.editPaper({activeQuestion: questionId, orderId});
    }
  }

  formatTime (time) {
    time = time / 10 >= 1 ? time : ('0' + time);
    return time;
  }

  render () {
    let hour = this.state.remainTime > 0 ? Math.floor(this.state.remainTime / constant.time.SECONDS_PER_MINUTE / constant.time.MINUTE_PER_HOUR) : 0;
    let minutes = this.state.remainTime > 0 ? Math.floor(this.state.remainTime / constant.time.SECONDS_PER_MINUTE - hour * constant.time.MINUTE_PER_HOUR) : 0;
    let seconds = this.state.remainTime > 0 ? this.state.remainTime % constant.time.MINUTE_PER_HOUR : 0;
    hour = this.formatTime(hour);
    minutes = this.formatTime(minutes);
    seconds = this.formatTime(seconds);

    const questions = this.props.questions ? this.props.questions.map((questionId, index) => {
      let orderId = index + 1;
      let classStr = 'quiz-number ' + (this.state.orderId === orderId ? 'selected' : '');
      return (<button className={classStr} onClick={this.handleClick.bind(this, orderId, questionId)} key={index}>
        <div>题目{orderId}</div>
      </button>);
    }) : [];
    return (
      <div>
        <div className='section-header'>
          <div className='section-title'>逻辑题</div>
          <div className='section-description'>请仔细阅读内容,并在规定时间段内答完题目</div>
          <div><span className='remain-time'>剩余时间</span><span className='logic-timer'>{hour}:{minutes}:{seconds}</span>
          </div>
        </div>
        <div className='section-quizzes'>
          {questions}
        </div>
        <div className='section-submit'>
          <button className='logic-submit'>提交试卷</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({paperDetail}) => {
  return {
    orderId: paperDetail.orderId,
    sectionId: paperDetail.activeSection.sectionId,
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

export default connect(mapStateToProps, mapDispatchToProps)(LogicSidebar);
