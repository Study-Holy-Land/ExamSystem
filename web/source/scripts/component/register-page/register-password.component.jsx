/*eslint no-magic-numbers: 0*/

'use strict';


var LoginStore = require('../../store/register-page/login-store');
var RegisterStore = require('../../store/register-page/register-store');
var RegisterActions = require('../../actions/register-page/register-actions');
var Reflux = require('reflux');
var constraint = require('../../../../mixin/register-constraint');
var validate = require('validate.js');

function getError(validateInfo, field) {
  if (validateInfo && validateInfo[field] && validateInfo[field].length > 0) {
    return validateInfo[field][0];
  }
  return '';
}

function passwordSafe(val) {
  if (val === '') {
    return 0;
  }
  var safeRegex = [
    new RegExp('(?=.{6,}).*', 'g'),
    new RegExp('^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$', 'g'),
    new RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g')
  ];

  var result = 1;
  safeRegex.forEach(function (reg, i) {
    result = reg.test(val) ? i + 1 : result;
  });

  return result;
}

function getPosition(level) {
  var levelNumber = [1, 2, 3];

  for (var position = 0; position < levelNumber.length; position++) {
    if (level < levelNumber[position] + 1) {
      return position;
    }
  }
}
var RegisterPassword = React.createClass({
  mixins: [Reflux.connect(RegisterStore), Reflux.connect(LoginStore)],

  getInitialState: function () {
    return {
      password: '',
      passwordError: '',
      isShowToggle: false,
      passwordSafeLevel: '',
      passwordSafeStyle: '',
      isLoginState: false
    };
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (!this.state.isLoginState && prevState.isLoginState) {
      this.refs.password.value = '';
      this.setState({
        password: '',
        passwordError: '',
        passwordSafeLevel: '',
        passwordSafeStyle: ''
      });
    }
  },

  toggleState: function () {
    RegisterActions.changeState(this.state.isShowToggle);
  },

  checkPasswordSafe: function (event) {
    var value = event.target.value;
    var level = passwordSafe(value);
    var levelGrade = ['danger', 'general', 'safe'];
    var position = getPosition(level);

    RegisterActions.inputPassword(value);
    this.setState({passwordSafeStyle: levelGrade[position]});
    this.setState({passwordSafeLevel: level});
  },

  validate: function (event) {
    var target = event.target;
    var value = target.value;
    var name = target.name;
    var valObj = {};
    valObj[name] = value;

    var result = validate(valObj, constraint);
    var error = getError(result, name);
    var stateObj = {};
    stateObj[name + 'Error'] = error;
    this.setState(stateObj);
  },

  focusPassword(){
    this.refs.password.focus();
  },

  jumpInvitationCode(e){
    if(e.keyCode === 13){
      this.props.onJumpInvitationCode();
    }
  },

  render: function () {

    return (
      <div>
        <input className="form-control" type={(this.state.isShowToggle === false ? 'password' : 'text')}
               placeholder="请输入8~16位密码" name="password" ref="password" id="register-password"
               onBlur={this.validate} onChange={this.checkPasswordSafe} disabled={this.props.isDisabled} onKeyUp={this.jumpInvitationCode}
        />
        <div className={'lose' + (this.state.passwordError === '' ? ' hide' : '')}>{this.state.passwordError}</div>
        <ul className="passport-safely">
          <li className={this.state.passwordSafeLevel >= 1 ? this.state.passwordSafeStyle : ''}>弱</li>
          &nbsp;
          <li className={this.state.passwordSafeLevel >= 2 ? this.state.passwordSafeStyle : ''}>中</li>
          &nbsp;
          <li className={this.state.passwordSafeLevel === 3 ? this.state.passwordSafeStyle : ''}>强</li>
          &nbsp;
          <li className="toggle" onClick={this.toggleState} isShowToggle={this.state.isShowToggle}>
            {this.state.isShowToggle ? '隐藏密码' : '显示密码'}</li>
        </ul>
      </div>
    );
  }
});
module.exports = RegisterPassword;