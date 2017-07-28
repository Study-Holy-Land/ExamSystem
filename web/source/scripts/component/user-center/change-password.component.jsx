'use strict';

var validate = require('validate.js');
var constraint = require('../../../../mixin/password-constraint');
var getError = require('../../../../mixin/get-error');
var ChangePasswordActions = require('../../actions/user-center/change-password-actions');
var PasswordActions = require('../../actions/reuse/password-actions');
var ChangePasswordStore = require('../../store/user-center/change-password-store');
var UserCenterStore = require('../../store/user-center/user-center-store');
var PasswordStore = require('../../store/reuse/password-store');
var Reflux = require('reflux');

const hashArray = window.location.hash.split('?');
const currentHash = hashArray[0].substr(1);

var ChangePassword = React.createClass({
  mixins: [Reflux.connect(ChangePasswordStore), Reflux.connect(UserCenterStore), Reflux.connect(PasswordStore)],

  getInitialState: function () {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      oldPasswordError: '',
      newPasswordError: '',
      confirmPasswordError: '',
      success: false,
      isRespond: false,
      currentState: currentHash
    };
  },

  componentDidUpdate: function (prevProps, prevState) {

    if (prevState.currentState !== this.state.currentState) {
      this.setState({
        oldPassword: '',
        oldPasswordError: '',
        success: false
      });
    }
  },

  validate: function (evt) {
    var target = evt.target;
    var name = target.name;
    var value = target.value;
    var valObj = {};

    valObj[name] = value;
    var result = validate(valObj, constraint);
    var error = getError(result, name);
    var stateObj = {};

    stateObj[name + 'Error'] = error;
    this.setState(stateObj);
  },

  handleChange: function (evt) {
    var newState = evt.target.value;
    var stateName = evt.target.name;

    this.setState({[stateName]: newState});
  },

  checkInfo: function () {
    var oldPassword = {oldPassword: this.state.oldPassword};
    var result = validate(oldPassword, constraint);
    var error = getError(result, 'oldPassword');

    if (result === undefined && this.state.newPasswordError === '' && this.state.confirmPasswordError === '') {
      return true;
    }
    this.setState({oldPasswordError: error});
    return false;

  },

  savePassword: function () {
    var passwordData = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
      confirmPassword: this.state.confirmPassword
    };
    PasswordActions.submitEvent('submit');

    if (!this.checkInfo()) {
      return;
    }
    ChangePasswordActions.changePassword(passwordData);
    this.setState({isRespond: true});
  },

  render: function () {
    var classString = (this.state.currentState === 'password' ? '' : ' hide');
    return (
      <div className={'col-md-10 col-sm-10 col-xs-12 content-padding' + classString}>
        <div className="content">
          <form className="form-horizontal form-top-height col-sm-8 col-md-8 col-sm-offset-2 col-md-offset-2">
            <div className="col-sm-3 col-md-3 col-md-offset-4 col-sm-offset-4">
              <div className={'success-prompt alert alert-success' + (this.state.success ? '' : ' visibility')}>
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
                修改成功
              </div>
            </div>

            <div id="change-password">
              <div className="oldPassword col-sm-12 col-md-12">
                <label htmlFor="oldPassword" className="col-sm-3 col-md-3 control-label">旧密码</label>
                <div
                  className={'form-group col-sm-6 col-md-6 has-' + (this.state.oldPasswordError === '' ? '' : 'error')}>
                  <input type="password" className="form-control" aria-describedby="helpBlock2"
                         name="oldPassword" id="oldPassword"
                         placeholder="请输入旧密码" onBlur={this.validate}
                         onChange={this.handleChange} value={this.state.oldPassword}/>
                </div>
                <span
                  className={'col-sm-3 col-md-3 error alert alert-danger' + (this.state.oldPasswordError === '' ? ' hide' : '')}
                  aria-hidden="true" role="alert">
                    <i className="glyphicon glyphicon-exclamation-sign"/>
                  {this.state.oldPasswordError}
                  </span>
              </div>

              {this.props.children}

              <div className="form-group">
                <div className="col-sm-offset-3 col-sm-4 col-md-offset-3 col-md-4">
                  <button type="button" className="btn btn-default btn-password-info" onClick={this.savePassword}
                          disabled={this.state.isRespond}>保存
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = ChangePassword;
