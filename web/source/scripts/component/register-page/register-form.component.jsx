'use strict';

var Reflux = require('reflux');
var validate = require('validate.js');
var constraint = require('../../../../mixin/register-constraint');
var constant = require('../../../../mixin/constant');
var async = require('async');
var RegisterActions = require('../../actions/register-page/register-actions');
var RegisterStore = require('../../store/register-page/register-store');
var LoginStore = require('../../store/register-page/login-store');
var RegisterPassword = require('./register-password.component.jsx');
var Captcha = require('./captcha.component.jsx');


var asyncContainersFunc = {
  email: function (value, done) {
    RegisterActions.checkEmail(value, done);
  },
  mobilePhone: function (value, done) {
    RegisterActions.checkMobilePhone(value, done);

  },
  captcha: function (value, done) {
    if (value.length !== 4) {
      done({captchaError: '验证码位数错误'})
    }
    if (value.length === 0) {
      done({captchaError: '请输入验证码'})
    }
    done({captchaError: ''})
  },
  invitationCode: function (value, done) {
    if (value.length !== 0 && value.length !== 8 && value.length !== 12) {
      return done({invitationCodeError: '邀请码位数错误'})
    }
    return done({invitationCodeError: ''})
  }

};

function getError(validateInfo, field) {
  if (validateInfo && validateInfo[field] && validateInfo[field].length > 0) {
    return validateInfo[field][0];
  }
  return '';
}


var RegisterForm = React.createClass({
  mixins: [Reflux.connect(RegisterStore), Reflux.connect(LoginStore)],

  getInitialState: function () {

    return {
      userNameError: '',
      mobilePhoneError: '',
      emailError: '',
      captchaError: '',
      invitationCodeError: '',
      agree: false,
      clickable: false,
      password: '',
      captcha: '',
      invitationCodeStyle: '',
      loginState: this.props.loginState
    };
  },

  componentDidMount: function () {
    var programArray = (document.cookie).split(';')
        .find(item => item.includes('program'));
    if (programArray !== undefined) {
      const programCode = programArray.split('=')[1];
      if (programCode !== 'undefined') {
        this.setState({invitationCodeStyle: ' hide'});
        this.refs.invitationCode.value = programCode;
      }
    }

  },

  validate: function (event) {
    var target = event.target;
    var value = target.value.trim();

    var name = target.name;
    var valObj = {};
    valObj[name] = value;

    var result = validate(valObj, constraint);
    var error = getError(result, name);
    var stateObj = {};
    stateObj[name + 'Error'] = error;
    this.setState(stateObj, () => {

    });

    if ('' === error && name !== 'password' && name !== 'userName') {
      asyncContainersFunc[name](value, (stateObj) => {
        this.setState(stateObj);
      });
    }
  },

  changeAgreeState: function () {
    var newState = !this.state.agree;
    this.setState({agree: newState});
  },

  checkRegisterData: function (registerInfo) {
    var passCheck = true;
    if (this.state.agree === false) {
      $('#agree-check').modal('show');
      passCheck = false;
    }

    var stateObj = {};
    registerInfo.forEach((item, i) => {
      var valObj = {};

      var value = item.value.trim();
      var name = item.name;

      valObj[name] = value;
      var result = validate(valObj, constraint);

      var error = getError(result, name);

      if (name === 'captcha' && value.length === 0) {
        error = '请输入验证码';
        passCheck = false;
      }

      if (error !== '') {
        passCheck = false;
      }

      stateObj[name + 'Error'] = error;
    });

    RegisterActions.checkData(stateObj);
    return passCheck;
  },

  updateCaptcha: function (captchaMsg) {
    this.setState(captchaMsg)
  },

  register: function () {

    if (this.state.mobilePhoneError != '' || this.state.mobilePhoneError !== '' || this.state.emailError !== '' || this.state.captchaError !== '' || this.state.invitationCodeError !== '') {
      return false;
    }

    var registerData = [];
    var userName = ReactDOM.findDOMNode(this.refs.userName);
    var mobilePhone = ReactDOM.findDOMNode(this.refs.mobilePhone);
    var email = ReactDOM.findDOMNode(this.refs.email);
    var invitationCode = ReactDOM.findDOMNode(this.refs.invitationCode);
    var password = {
      name: 'password',
      value: this.state.password
    };

    var captcha = {
      name: 'captcha',
      value: this.state.captcha
    };

    registerData.push(userName, mobilePhone, email, password, invitationCode, captcha);

    if (!this.checkRegisterData(registerData)) {
      return false;
    } else {
      this.setState({
        clickable: true
      });

      RegisterActions.register(userName.value.trim(), mobilePhone.value.trim(), email.value.trim(), password.value.trim(), invitationCode.value.trim(), captcha.value.trim());
    }
  },

  jumpNext(e){
    if (e.keyCode === 13 && e.target === this.refs.userName) {
      this.refs.mobilePhone.focus();
    } else if (e.keyCode === 13 && e.target === this.refs.mobilePhone) {
      this.refs.email.focus();
    } else if (e.keyCode === 13 && e.target === this.refs.email) {
      let registerPasswordComponent = this.refs.registerPasswordComponent;
      registerPasswordComponent.focusPassword();
    } else if (e.keyCode === 13 && e.target === this.refs.invitationCode) {
      let captchaComponent = this.refs.captchaComponent;
      captchaComponent.focusCaptcha();
    }
  },

  jumpAgreeState(){
    this.refs.agreeCheck.focus();

  },

  jumpRegister(e){
    if (e.keyCode === 13) {
      this.register();
    }
  },

  jump(){
    if (this.state.invitationCodeStyle === '') {
      this.refs.invitationCode.focus();
    } else {
      let captchaComponent = this.refs.captchaComponent;
      captchaComponent.focusCaptcha();
    }
  },

  render: function () {
    var classString = 'col-md-7 logon-form-container';

    return (
        <div id="register" className={classString}>
          <label className={'registerable' + (this.props.isDisabled ? '' : ' hide')}>注册已关闭</label>
          <h4 className="welcome">欢迎注册思特沃克学院</h4>

          <form action='user-center.html#userDetail'>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="请输入昵称" name="userName" ref="userName"
                     onBlur={this.validate} disabled={this.props.isDisabled} onKeyUp={this.jumpNext}/>
              <div
                  className={'lose' + (this.state.userNameError === '' ? ' hide' : '')}> {this.state.userNameError} </div>

            </div>

            <div className="form-group">
              <input className="form-control" type="text" placeholder="请输入手机号" name="mobilePhone" ref="mobilePhone"
                     onBlur={this.validate} disabled={this.props.isDisabled} onKeyUp={this.jumpNext}/>
              <div
                  className={'lose' + (this.state.mobilePhoneError === '' ? ' hide' : '')}>{this.state.mobilePhoneError}</div>
            </div>

            <div className="form-group">
              <input className="form-control" type="text" placeholder="请输入邮箱" name="email" ref="email"
                     onBlur={this.validate} disabled={this.props.isDisabled} onKeyUp={this.jumpNext}/>

              <div className={'lose' + (this.state.emailError === '' ? ' hide' : '')}>{this.state.emailError}</div>
            </div>

            <div className="form-group">
              <RegisterPassword ref="registerPasswordComponent" onJumpInvitationCode={this.jump}/>
            </div>

            <div className={"form-group" + this.state.invitationCodeStyle}>
              <input className="form-control" type="text" placeholder="请输入邀请码(可选)" name="invitationCode"
                     ref="invitationCode" onBlur={this.validate} onKeyUp={this.jumpNext}/>
              <div
                  className={'lose' + (this.state.invitationCodeError === '' ? ' hide' : '')}>{this.state.invitationCodeError}</div>
            </div>

            <div className="form-group">
              <Captcha updateCaptcha={this.updateCaptcha} isDisabled={this.props.isDisabled} ref="captchaComponent"
                       onJumpAgreeState={this.jumpAgreeState} loginState={this.state.loginState}/>
            </div>

            <div className="checkbox">
              <label>
                <input type="checkbox" className="agree-check" onClick={this.changeAgreeState}
                       disabled={this.props.isDisabled} ref="agreeCheck" onKeyUp={this.jumpRegister}/> 同意
              </label>
              <a id="agreement" data-toggle="modal" data-target="#registerAgreement">注册协议</a>
              <span>和</span>
              <a id="agreement" data-toggle="modal" data-target="#securityAgreement">保密协议</a>
            </div>

            <button type="button" onClick={this.register} id="register-btn" ref="register"
                    className="btn btn-lg btn-block btn-primary"
                    disabled={this.props.isDisabled || this.state.clickable}>注册
              <i className={'fa fa-spinner fa-spin' + (this.state.clickable ? '' : ' hide')}/>
            </button>
          </form>
        </div>
    );
  }
});

module.exports = RegisterForm;