'use strict';

var LoginInfo = React.createClass({

  toggleState: function () {
    // var newState = !this.props.isLoginState;
    // this.props.onStateChange(newState);
  },

  render: function () {

    var passwordRetrieve = 'password-retrieve ' + (this.props.isLoginState ? '' : 'hide');
    var weChatURI = "https://open.weixin.qq.com/connect/qrconnect?appid=wx0a53a01a2413d100&redirect_uri=" + REDIRECT_URL + "&response_type=code&scope=snsapi_login#wechat_redirect";

    return (
      <div id="login-info" className="col-md-5 register-form-right">
        <div id="register-right" className="link">
          {this.props.isLoginState ? '还没账号?' : '已有账号?'}
          <a id="change-to-logon" href={this.props.isLoginState ? 'register.html#register' : 'register.html#login'}
             onClick={this.toggleState}>
            {this.props.isLoginState ? '立即注册' : '立即登录'}
          </a>
        </div>
        <div className={passwordRetrieve}>
          忘记密码?<a href="password-retrieve.html?type=learner">立即找回</a>
        </div>
        {/*<div className="weChatLogin">*/}
          {/*<a*/}
            {/*href= {weChatURI}><i className="fa fa-weixin" aria-hidden="true"></i>&nbsp;&nbsp;微信帐号登录</a>*/}
        {/*</div>*/}
      </div>
    );
  }
});

module.exports = LoginInfo;
