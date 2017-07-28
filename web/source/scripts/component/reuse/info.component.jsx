'use strict';

var DashboardActions = require('../../actions/dashboard/dashboard-actions');
var DashboardStore = require('../../store/dashboard/dashboard-store');
var Reflux = require('reflux');

var Info = React.createClass({
  mixins: [Reflux.connect(DashboardStore)],

  getInitialState: function () {
    return {
      status: ''
    };
  },

  componentDidMount: function () {
    DashboardActions.getStatus();
  },

  render() {
    return (
      <div className="dialog">
        {
          this.state.status === 'overTime' ?
            <div>
              <h1>很抱歉,您已经无法答题了!</h1>
              <span>当一道编程题超过七天还没有通过的话,我们会认为您没有通过.</span>
            </div>
            :
            <div>
              <h1>恭喜您,您已经做完所有题目了!</h1>
              <span>这意味着您已经通过了我们的第一轮筛选，我们将会在<b>6月15号</b>通知您下一步的安排,请注意留意您的邮箱.</span>
            </div>
        }
        <p><a href="dashboard.html">点击返回</a></p>
      </div>
    );
  }
});

module.exports = Info;
