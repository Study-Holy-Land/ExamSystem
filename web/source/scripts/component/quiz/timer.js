import {Component} from 'react';
import {connect} from 'react-redux';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import constant from '../../../../mixin/constant';
import errorHandler from '../../../../tools/error-handler.jsx';

class Timer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      remainTime: '',
      sectionId: '',
      showTimer: false
    };
  }

  componentWillReceiveProps (next) {
    if (next.section && next.section.type === 'LogicPuzzle') {
      this.setState({sectionId: next.section._id, showTimer: true}, () => {
        this.getRemainTime(this.state.sectionId);
        this.countDown();
      });
    }
  }

  countDown () {
    setInterval(() => {
      if (this.state.remainTime) {
        let remainTime = this.state.remainTime - 1;

        if (remainTime <= 0) {
          this.props.onTimeOver(true);
        }

        this.setState({
          remainTime: remainTime
        });

        if (remainTime % (constant.time.SECONDS_PER_MINUTE * 2) === 1) {
          this.getRemainTime(this.state.sectionId);
        }
      }
    }, constant.time.MILLISECOND_PER_SECONDS);
  }

  getRemainTime (sectionId) {
    superagent
      .get(API_PREFIX + 'timer/remain-time')
      .query({sectionId})
      .use(noCache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({remainTime: res.body.remainTime});
      });
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
    return (
      <div className={this.state.showTimer ? '' : 'hidden'}>
        <span className='remain-time'>剩余时间</span><span className='logic-timer'>{hour}:{minutes}:{seconds}</span>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
