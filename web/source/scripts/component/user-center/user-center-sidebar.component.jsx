'use strict';

var Reflux = require('reflux');
var Nav = require('react-bootstrap/lib/Nav');
var NavItem = require('react-bootstrap/lib/NavItem');
var UserCenterActions = require('../../actions/user-center/user-center-actions');
var UserCenterStore = require('../../store/user-center/user-center-store');
var GetAccountStore = require('../../store/reuse/get-account-store');
var page = require('page');

const hashArray = window.location.hash.split('?');
const currentHash = hashArray[0].substr(1);

var UserCenterSide = React.createClass({
  mixins: [Reflux.connect(UserCenterStore), Reflux.connect(GetAccountStore)],

  getInitialState: function () {

    return {
      currentState: currentHash
    };
  },

  handleClick: function (mark, currentState) {
    UserCenterActions.changeState(mark, currentState);
    if (mark === 'userDetail') {
      UserCenterActions.loadUserDetail();
    }
    if (mark === 'result') {
      UserCenterActions.loadResult();
    }
    if (mark === 'message') {
      UserCenterActions.loadMessage();
    }
    if (mark === 'mentorManagement') {
      UserCenterActions.loadMentorManagement();
    }
    if (mark === 'studentManagement') {
      UserCenterActions.loadStudentManagement();
    }
  },

  render() {
    var studentTags = [
      {mark: 'userDetail', value: '个人信息'},
      {mark: 'password', value: '修改密码'},
      {mark: 'message', value: '消息中心'},
      {mark: 'mentorManagement', value: '教练管理'}
    ];

    var mentorTags = [
      {mark: 'userDetail', value: '个人信息'},
      {mark: 'password', value: '修改密码'},
      {mark: 'message', value: '消息中心'},
      {mark: 'studentManagement', value: '学生管理'}
    ];

    var tags = this.state.isMentor ? mentorTags : studentTags;

    var itemHtml = tags.map((item, index) => {
      var classStr = 'list-group-item ' + (item.mark === this.state.currentState ? 'selected' : '');

      return (
        <a className={classStr} href={'#' + item.mark} key={index}
           onClick={this.handleClick.bind(null, item.mark, this.state.currentState)}>
          <div className="row">
            <div className="col-xs-9 h4 text-center">{item.value}</div>
            <div className="col-xs-3"></div>
          </div>
        </a>
      );
    });

    return (
      <div className="col-md-2 col-sm-2 col-xs-12 sidebar-padding">
        <div className="list-group">
          {itemHtml}
        </div>
      </div>
    );
  }
});

module.exports = UserCenterSide;
