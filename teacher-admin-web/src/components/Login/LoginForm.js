import {Component} from 'react';
import {InputWrapper} from '../common';
import validate from 'validate.js';
import request from 'superagent';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import constant from '../../../mixin/constant';

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountError: '',
      passwordError: '',
      captchaError: '',
      loading: false,
      captchaLoaded: false,
      isLoading: true
    };
  }

  componentDidMount() {
    this.loadCaptcha();
  }

  checkLogin(e) {
    e.preventDefault();

    if (this.validateInput()) {
      this.setState(this.validateInput());
    } else {
      this.setState({
        loading: true,
        accountError: '',
        passwordError: '',
        captchaError: ''
      }, () => {
        const account = this.account.value;
        const password = this.password.value;
        const captcha = this.captcha.value;
        const identity = 'teacher';

        request.post(API_PREFIX + '/login')
          .send({account, password, captcha, identity})
          .end((req, res) => {
            this.setState({loading: false});
            if (res.body.status === constant.httpCode.FORBIDDEN) {
              this.setState({captchaError: '验证码错误'});
            } else if (res.body.status === constant.httpCode.UNAUTHORIZED) {
              this.setState({
                accountError: '用户名或密码错误',
                passwordError: '用户名或密码错误'
              });
            } else if (res.body.status === constant.httpCode.OK) {
              this.props.dispatch({
                type: 'NO_USER',
                authState: res.body.status
              });
              this.props.router.push(URI_PREFIX + '/');
            }
          });
      });
    }
  }

  validateInput() {
    const constraints = {
      account: {
        presence: {
          message: '^用户名不能为空'
        }
      },
      password: {
        presence: {
          message: '^密码不能为空'
        }
      },
      captcha: {
        presence: {
          message: '^验证码不能为空'
        },
        numericality: {
          message: '^验证码必须是数字'
        }
      }
    };

    const account = this.account.value;
    const password = this.password.value;
    const captcha = this.captcha.value;
    const errorInputMessage = validate({account, password, captcha}, constraints);
    const validateResult = {};

    for (let key in errorInputMessage) {
      validateResult[key + 'Error'] = errorInputMessage[key][0];
    }
    return errorInputMessage ? validateResult : undefined;
  }

  loadCaptcha() {
    if (this.state.captchaLoaded) {
      return;
    }
    this.captchaLoaded = true;

    var img = this.refs.img;
    img.onload = () => {
      this.setState({
        isLoading: false
      });
    };
    var hash = ('' + Math.random()).substr(3, 8);
    img.src = `${API_PREFIX}/captcha.jpg?_${hash}`;
  }

  reloadCaptcha() {
    this.captchaLoaded = false;
    this.setState({
      isLoading: false
    });

    this.loadCaptcha();
  }

  getInputWrapper() {
    return (<div>
      <InputWrapper warning={this.state.accountError}>
        <div className={!this.state.accountError ? 'input-info row' : 'input-info-null row'}>
          <div className='col-xs-11 no-padding'>
            <input type='text' className='input-form col-xs-12' ref={(ref) => {
              this.account = ref;
            }}
                   placeholder='邮箱'/>
          </div>
          <i className='input-icon fa fa-user col-xs-1 text-center'> </i>
        </div>
      </InputWrapper>
      <InputWrapper warning={this.state.passwordError}>
        <div className={!this.state.passwordError ? 'input-info row' : 'input-info-null row'}>
          <div className='col-xs-11 no-padding'>
            <input type='password' className='input-form col-xs-12' ref={(ref) => {
              this.password = ref;
            }}
                   placeholder='密码'/>
          </div>
          <i className='input-icon fa fa-lock col-xs-1 text-center'> </i>
        </div>
      </InputWrapper>

      <InputWrapper warning={this.state.captchaError}>
        <div
          className={!this.state.captchaError ? 'input-info col-md-8 col-xs-6' : 'input-info-null col-md-8 col-xs-6'}>
          <div className='col-xs-11 no-padding'>
            <input type='text' className='input-form col-xs-12' ref={(ref) => {
              this.captcha = ref;
            }}
                   placeholder='验证码'/>
          </div>
          <i className='input-icon fa fa-umbrella col-xs-1 text-center'> </i>
        </div>

        <div className='col-md-4 col-xs-6 captchar no-padding'>
          <img ref='img'
               className={this.state.isLoading ? 'hide' : 'pull-right'}
               alt=''
               onClick={this.reloadCaptcha.bind(this)}/>
        </div>
      </InputWrapper>
    </div>);
  }

  render() {
    return (
      <div id='login-form' className='col-md-4 col-md-offset-4 col-sm-offset-2 col-sm-8 col-xs-offset-1 col-xs-10'>
        <div className='login-main'>
          <h4 className='header'>
            <i className='fa fa-coffee'> </i>
            <span className='blue'>请输入您的信息</span>
          </h4>
          <div>
            {this.getInputWrapper()}
            <div className='form-footer row'>
              <div className='checkbox col-xs-8'>
                <label>
                  <input type='checkbox'/> 记住我
                </label>
              </div>
              <div className='col-xs-4'>
                <button type='button' className='pull-right btn btn-sm btn-primary'
                        onClick={this.checkLogin.bind(this)} disabled={this.state.loading ? 'disabled' : ''}>
                  <i className='fa fa-key'> </i>
                  <span className='bigger-110'>登&nbsp;录</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className='footer'>

          <div className='forgot'>
            <a href={STUDENT_URI_PREFIX + '/password-retrieve.html?type=admin'} data-target='#signup-box'
               className='user-forgot-link pull-right'>
              忘记密码 &nbsp;
              <i className='ace-icon fa fa-arrow-right'> </i>
            </a>
          </div>

        </div>
      </div>
    );
  }
}

export default connect(() => {
  return {};
})(withRouter(LoginForm));
