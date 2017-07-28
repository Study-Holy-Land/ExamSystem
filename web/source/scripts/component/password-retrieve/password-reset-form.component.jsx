'use strict';

var validate = require('validate.js');
var PasswordResetActions = require('../../actions/password-retrieve/password-reset-actions');
var PasswordActions = require('../../actions/reuse/password-actions');
var PasswordResetStore = require('../../store/password-retrieve/password-reset-store');
var Reflux = require('reflux');
var PasswordStore = require('../../store/reuse/password-store');
var constraint = require('../../../../mixin/confirm-password-constraint');
var constant = require('../../../../mixin/constant');
var lang = require('../../../../mixin/lang-message/chinese');
var getError = require('../../../../mixin/get-error');


var passwordResetForm = React.createClass({
  mixins: [Reflux.connect(PasswordResetStore), Reflux.connect(PasswordStore)],

  getInitialState: function () {
    return {
      showMessage: false,
      resetFailed: '',
      newPasswordError: '',
      confirmPasswordError: '',
      clickable: false,
      newPassword: '',
      confirmPassword: ''
    };
  },

  handleChange: function (event) {
    var value = event.target.value;
    var name = event.target.name;
    PasswordResetActions.changeValue(name, value);
  },

  checkInfo: function () {
    var newPassword = {newPassword: this.state.newPassword};
    var result = validate(newPassword, constraint);
    var newPasswordError = getError(result, 'newPassword');
    var stateObj = {};

    stateObj.newPasswordError = newPasswordError;
    PasswordResetActions.getError(stateObj);

    if (newPasswordError === '' && this.state.confirmPasswordError === '') {
      return true;
    } else {
      this.setState(stateObj);
      return false;
    }
  },

  reset: function (evt) {
    evt.preventDefault();
    PasswordActions.submitEvent('submit');

    if (!this.checkInfo()) {
      return;
    } else {
      this.setState({
        clickable: true
      });
      var newPassword = this.state.newPassword;
      var currentUrl = window.location.href;
      const start = currentUrl.indexOf('=') + 1;
      const end = currentUrl.indexOf('&');
      var token = currentUrl.substring(start, end);
      PasswordResetActions.reset(newPassword, token);
    }
  },

  toggleLogin: function () {
    const currentUrl = window.location.href;
    const type = currentUrl.split('type=')[1];
    const loginURI = DOMAIN + STUDENT_URI_PREFIX + '/admin/login';
    if (type === 'admin') {
      return <a href={loginURI}>回去登录</a>
    } else {
      return <a href="register.html#login">回去登录</a>

    }
  },

  render: function () {

    var retrieveClassName = 'password-reset-form-container ' + (this.state.showMessage ? 'hide' : '');
    var messageClassName = 'message-container ' + (this.state.showMessage ? '' : 'hide');
    return (
      <div>
        <div id="retrieve" className={retrieveClassName}>
          <h4 className="welcome">重置密码</h4>
          <div className={'lose' + (this.state.resetFailed === 'wrongUrl' ? '' : ' hide')} name="resetFailed">
            你的链接有误!
          </div>
          <div className={'lose' + (this.state.resetFailed === 'timeOut' ? '' : ' hide')} name="resetFailed">
            你的链接已过期!
          </div>
          <form action="" onSubmit={this.reset}>
            <div className="form-group">
              {this.props.children}
            </div>
            <button type="submit" id="reset-btn" className="btn btn-lg btn-block btn-primary col-md-offset-4"
                    disabled={this.state.clickable}>确认
              <i className={'fa fa-spinner fa-spin loading' + (this.state.clickable ? '' : ' hide')}/>
            </button>
          </form>
        </div>
        <div id="message" className={messageClassName}>
          <p>您的密码已经成功重置!再别忘了!</p>
          <p><strong>你可长点儿心吧!</strong></p>
          {this.toggleLogin()}
        </div>
      </div>
    );
  }
});

module.exports = passwordResetForm;
