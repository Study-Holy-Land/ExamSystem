'use strict';

var Reflux = require('reflux');
var TimerStore = require('../../store/logic-puzzle/timer-store');
var TimerActions = require('../../actions/logic-puzzle/timer-actions');
var Modal = require('react-bootstrap/lib/Modal');
var constant = require('../../../../mixin/constant');
var getQueryString = require('../../../../tools/getQueryString');
var programId = getQueryString('programId');
var paperId = getQueryString('paperId');
var sectionId = getQueryString('sectionId');

var LogicPuzzleTimer = React.createClass({
  mixins: [Reflux.connect(TimerStore)],

  componentDidMount: function () {
    TimerActions.getRemainTime(programId, paperId, sectionId);
    this.countDown();
  },

  countDown: function () {

    setInterval(() => {
      if (this.state.remainTime) {
        var remainTime = this.state.remainTime - 1;

        if (remainTime <= 0) {
          this.props.onTimeOver();
        }

        this.setState({
          remainTime: remainTime
        });

        if (remainTime % (constant.time.SECONDS_PER_MINUTE * 2) === 1) {
          TimerActions.getRemainTime(programId, paperId, sectionId);
        }
      }
    }, constant.time.MILLISECOND_PER_SECONDS);
  },

  render: function () {

    var minutes = this.state.remainTime > 0 ? Math.floor(this.state.remainTime / constant.time.SECONDS_PER_MINUTE) : 0;
    var seconds = this.state.remainTime > 0 ? this.state.remainTime % constant.time.MINUTE_PER_HOUR : 0;

    return (
      <p className="remain-time">
        您还有 {minutes} 分钟 {seconds} 秒
      </p>
    );
  }
});

module.exports = LogicPuzzleTimer;
