import React, {Component} from 'react';
import superagent from 'superagent';
import errorHandler from '../../tool/errorHandler';
import validate from 'validate.js';
import '../../style/animate.less';
import '../../style/toastr.less';
import constraint from '../../../mixin/constraint';
import constant from '../../../mixin/constant';
var ReactToastr = require('react-toastr');
var {ToastContainer} = ReactToastr;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

const tabsConfiguration = [
  {value: '新增'},
  {value: '修改'}
];

const roles = [
  {text: 'PracticeMaker', role: 1},
  {text: 'PaperMaker', role: 2},
  {text: 'ProgramManager', role: 3},
  {text: 'Mentor', role: 4}
];

class ErrorTip extends Component {
  render() {
    return (
      <span className='error-tip'>{this.props.error}</span>
    );
  }
}

export default class RoleManagementEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateFormEnable: false,
      infoFormEnable: true,
      activeIndex: 0,
      userNameError: '',
      mobilePhoneError: '',
      emailError: '',
      passwordError: '',
      roleStatus: [],
      role: [],
      currentRole: '',
      submitEnable: true
    };
  }

  validateInput() {
    const userName = this.userName.value;
    const mobilePhone = this.mobilePhone.value;
    const password = this.state.activeIndex === 1 ? this.password.placeholder : this.password.value;
    const email = this.email.value.trim();

    const errorInputMessage = validate({userName, mobilePhone, password, email}, constraint);

    const validateResult = {};
    for (let key in errorInputMessage) {
      validateResult[key + 'Error'] = errorInputMessage[key][0];
    }

    return (errorInputMessage || validateResult.emailError) ? validateResult : undefined;
  }

  handleTabsToggle(index) {
    if (index === 0) {
      this.clearForm();
      this.setState({
        updateFormEnable: false,
        infoFormEnable: true,
        activeIndex: index,
        userNameError: '',
        mobilePhoneError: '',
        emailError: '',
        passwordError: '',
        submitEnable: true
      });
    }
  }

  receivePropsData(currentUser) {
    const roleStatus = [];
    this.userName.value = currentUser.userName;
    this.email.value = currentUser.email;
    this.mobilePhone.value = currentUser.mobilePhone;
    this.password.placeholder = '*********';
    roles.map((item, index) => {
      if (currentUser.role.indexOf(item.role) !== -1) {
        roleStatus[index] = true;
      } else {
        roleStatus[index] = false;
      }
    });
    this.setState({
      roleStatus
    });
  }

  handleCheckedToggle(index) {
    const roleStatus = this.state.roleStatus;
    roleStatus[index] = !roleStatus[index];
    this.setState({
      roleStatus
    });
  }

  componentWillReceiveProps(next) {
    if (next.id) {
      this.receivePropsData(next);
      this.setState({
        id: next.id,
        activeIndex: 1,
        updateFormEnable: true,
        infoFormEnable: true,
        userNameError: '',
        mobilePhoneError: '',
        emailError: '',
        passwordError: ''
      });
    }
    if (this.state.currentRole !== this.props.currentRole) {
      this.clearForm();
      this.setState({
        currentRole: this.props.currentRole
      });
    }

    const isStudentOrAdmin = next.role.some((role) => role === 0 || role === 9);
    if (isStudentOrAdmin) {
      this.setState({infoFormEnable: false});
    }
  }

  clearForm() {
    this.userName.value = '';
    this.email.value = '';
    this.mobilePhone.value = '';
    this.password.value = '';
    this.password.placeholder = '';
    this.setState({
      roleStatus: []
    });
  }

  chooseStatus(res) {
    if (res.statusCode === constant.httpCode.CREATED) {
      this.props.addUser();
      this.clearForm();
      this.addAlert({text: '添加用户', success: '成功！'});
    }
  }

  sendRequest(info) {
    superagent.post(API_PREFIX + '/users')
      .send(info)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        if (res.body) {
          this.setState({
            emailError: res.body.emailError || '',
            mobilePhoneError: res.body.mobilePhoneError || ''
          });
        }
        this.chooseStatus(res);
      });
  }

  submit() {
    const formError = this.validateInput();
    if (formError) {
      this.setState({
        userNameError: formError.userNameError,
        mobilePhoneError: formError.mobilePhoneError,
        emailError: formError.emailError,
        passwordError: formError.passwordError
      });
      return;
    } else {
      this.getChooseRoles();
      let info = {
        userName: this.userName.value.trim(),
        email: this.email.value.trim(),
        mobilePhone: this.mobilePhone.value.trim(),
        password: this.password.value.trim(),
        role: this.state.role
      };
      this.setState({role: []});
      if (this.state.activeIndex === 1) {
        superagent.put(API_PREFIX + `/users/${this.state.id}`)
          .send(info)
          .use(errorHandler)
          .end((err, res) => {
            if (err) {
              throw err;
            } else {
              if (res.body) {
                this.setState({mobilePhoneError: res.body.mobilePhoneError || ''});
              } else if (res.statusCode === constant.httpCode.NO_CONTENT) {
                this.setState({
                  roleState: [],
                  submitEnable: true
                });
                this.props.updateUserInfo();
                this.addAlert({text: '修改用户信息', success: '成功！'});
                this.clearForm();
                this.setState({activeIndex: 0});
              }
            }
          });
      } else {
        this.sendRequest(info);
      }
    }
  }

  getChooseRoles() {
    let currentRole = this.state.role;
    this.state.roleStatus.map((roleBool, index) => {
      if (roleBool) {
        currentRole.push(roles[index].role);
      }
    });

    const oldRoles = this.props.role.filter(role => role !== null);
    if (oldRoles.length >= 0) {
      oldRoles.map((oldRole) => {
        const isHaveExceptRole = roles.find((item) => item.role === oldRole);
        if (!isHaveExceptRole) {
          currentRole.push(oldRole);
        }
      });
    }

    this.setState({
      role: currentRole
    });
  }

  hiddenErrorMessage(err) {
    var errObj = {};
    errObj[err] = '';
    this.setState(errObj);
  }

  addAlert(textInfo) {
    this.container.success(
      textInfo.success,
      textInfo.text, {
        timeOut: 3000,
        extendedTimeOut: 1000,
        showAnimation: 'animated bounceIn',
        hideAnimation: 'animated  bounceOut'
      });
  }

  getTabs() {
    return tabsConfiguration.map((tab, index) => {
      let active = this.state.activeIndex === index ? 'btn-primary' : 'btn-default';
      return (
        <div className='btn-group' role='group' key={index}>
          <button type='button' className={'btn ' + active}
                  disabled={index === 1 && !this.state.updateFormEnable ? 'disabled' : ''}
                  onClick={this.handleTabsToggle.bind(this, index)}>{tab.value}</button>
        </div>
      );
    });
  }

  render() {
    const emailDisabled = this.state.activeIndex === 1 && this.email.value ? 'disabled' : '';
    const infoFormEnable = this.state.infoFormEnable ? '' : 'disabled';
    const roleFormEnable = this.props.role.includes(9) && !this.state.infoFormEnable ? 'disabled' : '';
    return (
      <div>
        <ToastContainer ref={(ref) => {
          this.container = ref;
        }}
                        toastMessageFactory={ToastMessageFactory}
                        className='toast-center text-center col-sm-4'/>
        <div className='tab-ul'>
          <div className='btn-group btn-group-justified tab-padding' role='group'>
            {this.getTabs()}
          </div>
          <div id='role-management-editor'>
            <div className='role-management-form'>
              <label className='col-sm-4'>昵称</label>
              <div className='col-sm-8'>
                <input type='text' className='form-control' disabled={infoFormEnable}
                       ref={(ref) => {
                         this.userName = ref;
                       }} onFocus={this.hiddenErrorMessage.bind(this, 'userNameError')}/>
                <ErrorTip error={this.state.userNameError}/>
              </div>
            </div>

            <div className='role-management-form'>
              <label className='col-sm-4'>手机号</label>
              <div className='col-sm-8'>
                <input type='text' className='form-control' disabled={infoFormEnable}
                       ref={(ref) => {
                         this.mobilePhone = ref;
                       }} onFocus={this.hiddenErrorMessage.bind(this, 'mobilePhoneError')}/>
                <ErrorTip error={this.state.mobilePhoneError}/>
              </div>
            </div>

            <div className='role-management-form'>
              <label className='col-sm-4'>邮箱</label>
              <div className='col-sm-8'>
                <input type='text' className='form-control' disabled={emailDisabled}
                       ref={(ref) => {
                         this.email = ref;
                       }} onFocus={this.hiddenErrorMessage.bind(this, 'emailError')}/>
                <ErrorTip error={this.state.emailError}/>
              </div>
            </div>

            <div className='role-management-form'>
              <label className='col-sm-4'>密码</label>
              <div className='col-sm-8'>
                <input type='password' className='form-control' disabled={emailDisabled}
                       ref={(ref) => {
                         this.password = ref;
                       }} onFocus={this.hiddenErrorMessage.bind(this, 'passwordError')}/>
                <ErrorTip error={this.state.passwordError}/>
              </div>
            </div>

            <div className='role-management-form'>
              <label className='col-sm-4'>角色</label>
              <div className='col-sm-8'>
                {
                  roles.map((role, index) => {
                    return (
                      <div key={index} className='row no-margin'>
                        <input type='checkbox' value={role.text} disabled={roleFormEnable}
                               className='user-role no-margin col-sm-1'
                               checked={this.state.roleStatus[index]}
                               onClick={this.handleCheckedToggle.bind(this, index)}/>
                        <span className='col-sm-6'>{role.text}</span>
                      </div>
                    );
                  })
                }
              </div>
            </div>

            <div className='role-management-form text-center'>
              <button className='btn btn-primary btn-size'
                      disabled={!this.state.submitEnable}
                      onClick={this.submit.bind(this)}> 确定
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
