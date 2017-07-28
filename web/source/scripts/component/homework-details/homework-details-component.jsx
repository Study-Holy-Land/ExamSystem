'use strict';

var Reflux = require('reflux');
var HomeworkDetailsStore = require('../../store/homework-details/homework-details-store');
var HomeworkDetailsActions = require('../../actions/homework-details/homework-details-actions');
var moment = require('moment');

var HomeworkDetails = React.createClass({
  mixins: [Reflux.connect(HomeworkDetailsStore)],

  getInitialState: function () {
    return {
      userDetail: null
    };
  },

  getUserIdFromHref: function (sArgName) {
    var args = sArgName.split('=');
    return args[1];
  },

  componentWillMount: function () {
    console.log(window.location.href)
    var urlAddress = window.location.href;
    var userId = this.getUserIdFromHref(urlAddress);
    HomeworkDetailsActions.loadUserDetail(userId);
  },

  getQuizzesLength: function () {
    var sum = 0;

    var itemLength = this.state.userDetail.homework.quizzes.length;
    for (var i = 0; i < itemLength; i++) {
      var quizLength = this.state.userDetail.homework.quizzes[i].commitHistory.length;
      for (var k = 0; k < quizLength; k++) {
        sum++;
      }
    }
    return sum;
  },


  formatData: function (i, itemNumber, quizzesLength) {

    var quizLength = this.state.userDetail.homework.quizzes[i].commitHistory.length;

    for (var k = 0; k < quizLength; k++) {

      var userDetail = this.state.userDetail.userDetail;
      var commitHistory = this.state.userDetail.homework.quizzes[i].commitHistory[k];

      var date = new Date(this.state.userDetail.homework.quizzes[i].commitHistory[k].commitTime);
      date = moment.unix(date).format('MM-DD-YYYY HH:mm:ss');

      if (k === 0 && i === 0) {
        itemNumber.push(
          <tr >
            <td rowSpan={quizzesLength}>{userDetail.name}</td>
            <td rowSpan={quizzesLength}>{userDetail.mobilePhone}</td>
            <td rowSpan={quizzesLength}>{userDetail.email}</td>
            <td rowSpan={quizLength}>{k + 1}</td>
            <td>{k + 1}</td>
            <td>{date}</td>
            <td><a href={commitHistory.githubURL}>{commitHistory.githubURL}</a></td>
            <td>{commitHistory.branch}</td>
            <td><a href={commitHistory.resultURL}>{commitHistory.resultURL}</a></td>
          </tr>);

      } else {
        if (k === 0) {
          itemNumber.push(
            <tr>
              <td rowSpan={quizLength}>{i + 1}</td>
              <td>{k + 1}</td>
              <td>{date}</td>
              <td><a href={commitHistory.githubURL}>{commitHistory.githubURL}</a></td>
              <td>{commitHistory.branch}</td>
              <td><a href={commitHistory.resultURL}>{commitHistory.resultURL}</a></td>
            </tr>);
        } else {

          itemNumber.push(
            <tr>
              <td >{k + 1}</td>
              <td>{date}</td>
              <td><a href={commitHistory.githubURL}>{commitHistory.githubURL}</a></td>
              <td>{commitHistory.branch}</td>
              <td><a href={commitHistory.resultURL}>{commitHistory.resultURL}</a></td>
            </tr>);
        }

      }
    }
  },

  render: function () {

    var itemNumber = [];
    if (this.state.userDetail !== null) {
      var quizzesLength = this.getQuizzesLength();
      var itemLength = this.state.userDetail.homework.quizzes.length;

      for (var i = 0; i < itemLength; i++) {
        this.formatData(i, itemNumber, quizzesLength);
      }

    }

    return (
      <div className="row">
        <table className="table table-bordered">
          <thead>
          <tr>
            <th>姓名</th>
            <th>电话</th>
            <th>邮箱</th>
            <th>题号</th>
            <th>提交次数</th>
            <th>提交时间</th>
            <th>github仓库地址</th>
            <th>分支</th>
            <th>运行日志</th>
          </tr>
          </thead>
          <tbody>
          {itemNumber}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = HomeworkDetails;