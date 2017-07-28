/*eslint no-magic-numbers: 0*/

'use strict';

var homeworkQuizzesStatus = require('../../../../mixin/constant').homeworkQuizzesStatus;
var getQueryString = require('../../../../tools/getQueryString');
var page = require('page');

var HomeworkSidebar = React.createClass({
  getIconCss: function (state) {
    var icon = 'fa fa-lg fa-2x fa-';
    var iconList = ['lock', '', 'clock-o flashing', 'check-circle', 'times-circle'];
    var statusCode = [
      homeworkQuizzesStatus.LOCKED,
      homeworkQuizzesStatus.ACTIVE,
      homeworkQuizzesStatus.PROGRESS,
      homeworkQuizzesStatus.SUCCESS,
      homeworkQuizzesStatus.ERROR
    ];

    statusCode.forEach((item, index) => {
      if (state === item) {
        icon = icon + iconList[index];
      }
    });
    return icon;
  },

  backDashboard: function () {
    page(`dashboard.html?programId=${this.props.ids.programId}&paperId=${this.props.ids.paperId}`)
  },

  handleClick: function (orderId, questionId) {
    if (orderId !== this.props.orderId) {
      var sectionId = getQueryString('sectionId');
      page(`homework.html?sectionId=${sectionId}&questionId=${questionId}#${orderId}`);
      this.props.onOrderIdChange(orderId);
    }
  },

  render() {
    var itemHtml = this.props.homeworkQuizzes.map((item, index) => {
      var orderId = index + 1;
      var classStr = 'list-group-item ' + (this.props.orderId === orderId ? ' selected' : '');
      var iconCss = this.getIconCss(item.status);
      var quizName = item.homeworkName;
      var questionId = item.id;

      return (
        <button className={classStr}
                key={index}
                onClick={this.handleClick.bind(null, orderId, questionId)}>
          <div className="row">
            <div className="col-xs-9 h4 text-center ">{quizName}</div>
            <div className='col-xs-3'>
              <i className={iconCss}/></div>
          </div>
        </button>
      );
    });

    return (
      <div className="col-md-3 col-sm-3 col-xs-12">
        <div className="list-group">
          <div className="list-group-item active">
            <div className="row">
              <div className="col-xs-9 h3 text-center">编程题</div>
              <div className="col-xs-3"><i className='fa fa-2x fa-pencil-square-o home-icon'/></div>
            </div>
          </div>
          {itemHtml}
          <a className="btn btn-lg btn-success btn-block" onClick={this.backDashboard}>返回试卷</a>
        </div>
      </div>
    );
  }
});

module.exports = HomeworkSidebar;
