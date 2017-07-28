'use strict';
var GetAccountActions = require('../../actions/reuse/get-account-actions');
var GetAccountStore = require('../../store/reuse/get-account-store');
var UserCenterActions = require('../../actions/user-center/user-center-actions');
var UserCenterStore = require('../../store/user-center/user-center-store');
var Reflux = require('reflux');
var page = require('page');

var GetAccount = React.createClass({
  mixins: [Reflux.connect(GetAccountStore), Reflux.connect(UserCenterStore)],

  getInitialState: function () {
    return {
      isLoged: false,
      account: '',
      userName: '',
      isSuperAdmin: false
    };
  },

  componentDidMount: function () {
    if ("index" !== this.props.state) {
      GetAccountActions.loadAccount();
    }
  },

  logout: function () {
    GetAccountActions.logout();
  },

  getUserDetail(){
    const hashArray = window.location.hash.split('?');
    const currentHash = hashArray[0].substr(1);
    UserCenterActions.changeState('userDetail', currentHash);
    UserCenterActions.loadUserDetail();
  },

  render: function () {
    var userList = (
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          <li><a href="user-center.html#userDetail" onClick={this.getUserDetail}>个人中心</a></li>
          <li><a href="paper-list.html">控制台</a></li>
          <li role="separator" className="divider"/>
          <li><a onClick={this.logout}>退出</a></li>
        </ul>
    );

    var superAdminList = (
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          <li><a href="admin.html">管理中心</a></li>
          <li><a href="paper-assignment.html">试卷指定</a></li>
          <li role="separator" className="divider"/>
          <li><a onClick={this.logout}>退出</a></li>
        </ul>
    );

    return (
        <div className="header-right">
          <div className={(this.state.isLoged ? 'hide' : '') + ' login'}>
            <a className="register" href='register.html#login'>登录</a><a href='register.html#register'>注册</a>
          </div>
          <div className={this.state.isLoged ? 'dropdown' : 'hide'}>
            <div className="dropdown-style" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true"
                 aria-expanded="true">
              <div className="user-message-icon hidden">
                <i className="fa fa-bell bigger"></i>
              </div>
              <div className="user-name">
                {this.state.userName}
                <span className="caret"/>
              </div>
            </div>
            {this.state.isSuperAdmin ? superAdminList : userList}
          </div>
        </div>
    );
  }
});

module.exports = GetAccount;
