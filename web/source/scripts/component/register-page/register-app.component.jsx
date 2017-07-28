'use strict';

var Reflux = require('reflux');
var RegisterAction = require('../../actions/register-page/register-actions.js');
var RegisterStore = require('../../store/register-page/register-store.js');
var RegisterForm = require('./register-form.component.jsx');
var LoginForm = require('./login-form.component.jsx');
var SideInfo = require('./login-info.component.jsx');
var RegisterAgreement = require('./register-agreement.component.jsx');
var RegisterPassword = require('./register-password.component.jsx');
var Captcha = require('./captcha.component.jsx');
var getQueryString = require('../../../../tools/getQueryString');

var RegisterApp = React.createClass({
  mixins: [Reflux.connect(RegisterStore)],

  getCurrentState: function () {
    console.log(window.location.href)
    var state = window.location.href.split("#");
    return "login" === state[1] || !state[1];
  },

  getInitialState: function () {
    return {
      isDisabled: false,
      loginState: this.getCurrentState()
    }
  },

  componentWillMount: function () {
    var program = getQueryString('program');
    if (program) {
      document.cookie = `program=` + program;
    }
  },

  componentDidMount: function () {
    RegisterAction.registerable();
    var _this = this;

    window.onpopstate = function () {
      _this.setState({
        loginState: _this.getCurrentState()
      });
    }

  },

  render() {
    var formHtml = this.state.loginState ?
        (<LoginForm loginState={this.state.loginState}/>) :
        (<RegisterForm isDisabled={this.state.isDisabled} loginState={this.state.loginState}>
          <RegisterPassword isDisabled={this.state.isDisabled}/>
        </RegisterForm>);

    return (
        <div className="row">
          {formHtml}
          <SideInfo
              isLoginState={this.state.loginState}
              onStateChange={this.handleStateChange}/>
          <RegisterAgreement/>
        </div>
    );
  }
});

module.exports = RegisterApp;
