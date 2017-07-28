'use strict';

var validate = require('validate.js');
var getInvitationCodeActions = require('../../actions/paper-list/get-invitation-code-actions');
var getInvitationCodeStore = require('../../store/paper-list/get-invitation-code');
var Reflux = require('reflux');
var constraint = require('../../../../mixin/get-invitation-code');
var page = require('page');
// var constant = require('../../../../mixin/constant');

function getError(validateInfo, field) {
  if (validateInfo && validateInfo[field] && validateInfo[field].length > 0) {
    return validateInfo[field][0];
  }
  return '';
}

var getInvitationCodeForm = React.createClass({
  mixins: [Reflux.connect(getInvitationCodeStore)],

  getInitialState: function () {
    return {
      showMessage: false,
      getInvitationCodeFailed: false,
      emailError: '',
      clickable: false,
      email: ''
    };
  },

  validate: function (event) {
    var target = event.target;
    var value = target.value.trim();
    var name = target.name;
    var valObj = {};
    var result;
    var error;
    var stateObj = {};
    valObj[name] = value;
    result = validate(valObj, constraint);
    error = getError(result, name);
    stateObj[name + 'Error'] = error;
    this.setState(stateObj);
  },

  getInvitationCode: function (evt) {
    evt.preventDefault();
    if (!this.refs.email.value || this.state.emailError) {

      var valObj = {};
      var stateObj = {};

      valObj.email = this.refs.email.value;
      stateObj.emailError = getError(validate(valObj, constraint), 'email');

      this.setState(stateObj);
    } else {

      this.setState({
        clickable: true
      });
      var email = this.refs.email.value.trim();
      getInvitationCodeActions.getInvitationCode(email);
    }
  },

  back: function () {
    page('paper-list.html');
  },

  render: function () {
    var getInvitationCode = 'password-retrieve-form-container ' + (this.state.showMessage ? 'hide' : '');
    var messageClassName = 'message-container ' + (this.state.showMessage ? '' : 'hide');

    return (
      <div>
        <div id="retrieve" className={getInvitationCode}>
          <h4 className="welcome">获取邀请码</h4>
          <div className={'lose' + (this.state.getInvitationCodeFailed === false ? ' hide' : '')} name="retrieveFailed">
            邮箱不存在
          </div>

          <form action="" onSubmit={this.getInvitationCode}>
            <div className="form-group">
              <input className="form-control" type="text" placeholder="请输入邮箱" name="email"
                     onBlur={this.validate} onkeypress="if(event.keyCode==13||event.which==13){return false;}"
                     ref="email" autoComplete="off"/>
              <div
                className={'lose' + (this.state.emailError === '' ? ' hide' : '')}>{this.state.emailError}
              </div>
            </div>
            <div className="row">
              <div className="col-md-9 col-sm-9">
                <button type="submit" id="retrieve-btn"
                        className="btn btn-block btn-primary col-md-offset-6 col-xs-offset-4"
                        disabled={this.state.clickable}>确认
                  <i className={'fa fa-spinner fa-spin loading' + (this.state.clickable ? '' : ' hide')}/>
                </button>
              </div>
            </div>
          </form>

        </div>
        <div id="message" className={messageClassName}>
          <p>您的获取邀请码链接已经发送至邮箱<strong>{this.state.email}</strong>中,请注意查收!<a href='paper-list.html'>返回试卷列表</a></p>
        </div>
      </div>
    );
  }
});

module.exports = getInvitationCodeForm;
