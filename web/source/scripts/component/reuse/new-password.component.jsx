'use strict';

var validate = require('validate.js');
var Reflux = require('reflux');
var getError = require('../../../../mixin/get-error');
var constraint = require('../../../../mixin/confirm-password-constraint');
var lang = require('../../../../mixin/lang-message/chinese');
var PasswordActions = require('../../actions/reuse/password-actions');
var PasswordStore = require('../../store/reuse/password-store');
var ChangePasswordStore = require('../../store/user-center/change-password-store');
var UserCenterStore = require('../../store/user-center/user-center-store');
var PasswordResetStore = require('../../store/password-retrieve/password-reset-store');

var NewPassword = React.createClass({
  mixins: [Reflux.connect(PasswordStore), Reflux.connect(ChangePasswordStore), Reflux.connect(UserCenterStore), Reflux.connect(PasswordResetStore)],

  getInitialState: function () {
    return {
      newPassword: '',
      newPasswordError: '',
      confirmPassword: '',
      confirmPasswordError: '',
      initialStatus: this.props.initialStatus,
      event: ''
    };
  },

  // validate: function () {
  //   var names = Object.keys(this.refs);
  //   var value;
  //
  //   names.forEach((name) => {
  //     value = this.refs[name].value;
  //     this.state[name] = value;
  //   });
  //   var valObj = {
  //     newPassword: this.state.newPassword,
  //     confirmPassword: this.state.confirmPassword
  //   };
  //   var result = validate(valObj, constraint);
  //   var stateObj = {};
  //
  //   stateObj.newPasswordError = getError(result, 'newPassword');
  //   if (this.state.confirmPassword !== this.state.newPassword) {
  //     stateObj.confirmPasswordError = lang.CONFIRM_ERROR;
  //   } else {
  //     stateObj.confirmPasswordError = '';
  //   }
  //   this.setState(stateObj);
  //   PasswordActions.getPasswordError(stateObj);
  //   PasswordActions.changeNewPassword(valObj);
  // },

  validateNewPassword: function () {
    const newPassword = this.newPassword.value.trim();
    const result = validate({newPassword}, constraint);
    const newPasswordError = getError(result, 'newPassword');
    this.setState({
      newPassword,
      newPasswordError
    });
    PasswordActions.getPasswordError({newPasswordError});
    PasswordActions.changeNewPassword({newPassword});
  },

  validateConfirmPassword: function () {
    const confirmPassword = this.confirmPassword.value.trim();
    let confirmPasswordError = '';
    if (confirmPassword !== this.state.newPassword) {
      confirmPasswordError = lang.CONFIRM_ERROR;
    } else {
      confirmPasswordError = '';
    }
    this.setState({
      confirmPassword,
      confirmPasswordError
    });
    PasswordActions.getPasswordError({confirmPasswordError});
    PasswordActions.changeNewPassword({confirmPassword});
  },

  hiddenErrorMessage: function () {
    this.setState({
      newPasswordError: '',
      confirmPasswordError: ''
    });
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.initialStatus !== this.state.currentState) {
      this.newPassword.value = '';
      this.confirmPassword.value = '';
      this.setState({
        newPasswordError: '',
        confirmPasswordError: '',
        initialStatus: this.state.currentState
      });
    }
  },

  handleChange: function (evt) {
    var newState = evt.target.value;
    var stateName = evt.target.name;

    this.setState({[stateName]: newState});
  },

  render: function () {
    return (
      <div className="new-password ">
        <div className="col-sm-12 col-md-12">
          <label htmlFor="newPassword" className="col-sm-3 col-md-3 control-label">新密码</label>
          <div className={'form-group col-sm-6 col-md-6 has-' + (this.state.newPasswordError === '' ? '' : 'error')}>
            <input type="password" className="form-control" aria-describedby="helpBlock2"
                   name="newPassword" id="newPassword"
                   placeholder="请输入新密码" onBlur={this.validateNewPassword}
                   onFocus={this.hiddenErrorMessage}
                   ref={(ref)=> {
                     this.newPassword = ref;
                   }}/>
          </div>
          <span
            className={'col-sm-3 col-md-3 error alert alert-danger' + (this.state.newPasswordError === '' ? ' hide' : '')}
            aria-hidden="true" role="alert">
                  <i className="glyphicon glyphicon-exclamation-sign"/>
            {this.state.newPasswordError}
            </span>
        </div>
        <div className="col-sm-12 col-md-12">
          <label htmlFor="confirmPassword" className="col-sm-3 col-md-3 control-label">确认密码</label>
          <div
            className={'form-group col-sm-6 col-md-6 has-' + (this.state.confirmPasswordError === '' ? '' : 'error')}>
            <input type="password" className="form-control" aria-describedby="helpBlock2"
                   name="confirmPassword" id="confirmPassword"
                   placeholder="请再次确认新密码" onBlur={this.validateConfirmPassword}
                   onFocus={this.hiddenErrorMessage}
                   ref={(ref)=> {
                     this.confirmPassword = ref;
                   }}/>
          </div>
          <span
            className={'col-sm-3 col-md-3 error alert alert-danger' + (this.state.confirmPasswordError === '' ? ' hide' : '')}
            aria-hidden="true" role="alert">
            <i className="glyphicon glyphicon-exclamation-sign"/>
            {this.state.confirmPasswordError}
          </span>
        </div>

      </div>
    );
  }
});

module.exports = NewPassword;
