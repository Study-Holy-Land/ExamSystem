'use strict';

var Reflux = require('reflux');
var UserCenterStore = require('../../store/user-center/user-center-store');
var UserCenterActions = require('../../actions/user-center/user-center-actions');

var FeedbackResult = React.createClass({
  mixins: [Reflux.connect(UserCenterStore)],

  getInitialState: function () {
    return {
      logicPuzzle: '',
      homework: []
    };
  },

  componentDidMount: function () {
    UserCenterActions.loadResult();
  },

  render() {
    var classString = (this.state.currentState === 'result' ? '' : ' hide');
    var list = this.state.homework;
    var homeworkResult = list.map((item, index) => {

      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.commitedNumbers}</td>
          <td>{item.isCompleted ? '已完成' : '未完成'}</td>
          <td>{item.time}</td>
        </tr>
      );
    });
    return (
      <div className={'col-md-9 col-sm-9 col-xs-12' + classString}>
        <div className="content show-result">
          <div className="logicPuzzle">
            <table className="table table-hover">
              <caption>逻辑题</caption>
              <thead>
              <tr>
                <th>花费时间</th>
                <th>当前进度</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{this.state.logicPuzzle.time ? this.state.logicPuzzle.time : '--'}</td>
                <td>{this.state.logicPuzzle.isCompleted ? '已完成' : '未完成'}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div className="homework">
            <table className="table table-hover">
              <caption>编程题</caption>
              <thead>
              <tr>
                <th>题号</th>
                <th>提交次数</th>
                <th>当前进度</th>
                <th>花费时间</th>
              </tr>
              </thead>
              <tbody>
              {homeworkResult}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FeedbackResult;
