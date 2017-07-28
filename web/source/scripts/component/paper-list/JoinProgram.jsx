"use strict";
var superAgent = require('superagent');
var constant = require('../../../../mixin/constant');
var page = require('page');
var ReactToastr = require('react-toastr');
var Cookies = require('cookies-js');
var errorHandler = require('../../../../tools/error-handler.jsx');

var {ToastContainer} = ReactToastr;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

var JoinProgram = React.createClass({
  getInitialState: function () {
    return {
      cheUrl: '',
      codeError: ''
    };
  },

  addAlert(textInfo) {
    this.container[textInfo.result](
      textInfo.success,
      textInfo.text, {
        timeOut: 3000,
        extendedTimeOut: 1000,
        showAnimation: 'animated bounceIn',
        hideAnimation: 'animated bounceOut'
      });
    this.props.onJoinProgramResult({message: "成功！"})
  },

  codeClick(){
    if (this.code.value.length !== 8 && this.code.value.length !== 12) {
      this.setState({
        codeError: "请输入8位或12位邀请码"
      });
    } else {
      this.setState({
        codeError: ''
      }, ()=> {
        if (this.code.value.length === 8) {
          superAgent.post(API_PREFIX + 'programs/programCode')
            .send({
              programCode: this.code.value
            })
            .use(errorHandler)
            .end((err, res) => {
              if (err) {
                if (err.status === 409) {
                  this.code.value = '';
                  return this.addAlert({text: ' 您已经加入该program!', success: '', result: 'error'});
                }
                if (err.status === 404) {
                  this.code.value = '';
                  return this.addAlert({text: ' 输入的邀请码不存在!', success: '', result: 'error'});
                }
              }
              this.code.value = '';
              this.addAlert({text: '加入program', success: '成功！', result: 'success'});
            })
        } else {
          superAgent.post(API_PREFIX + 'programs/invitationCode')
            .send({
              invitationCode: this.code.value
            })
            .use(errorHandler)
            .end((err, res) => {
              if (err) {
                if (err.status === 404) {
                  this.code.value = '';
                  return this.addAlert({text: ' 您输入的邀请码不存在！', success: '', result: 'error'});
                }
                if (err.status === 400) {
                  this.code.value = '';
                  return this.addAlert({text: ' 您输入的邀请码已失效!', success: '', result: 'error'});
                }
                if (err.status === 409) {
                  this.code.value = '';
                  return this.addAlert({text: ' 您已经加入该program!', success: '', result: 'error'});
                }
              }
              this.code.value = '';
              this.addAlert({text: '加入program', success: '成功！', result: 'success'});
            })
        }
      });
    }
  },

  clearError(){
    this.setState({
      codeError: ''
    });
  },

  componentDidMount(){
    superAgent.get(`${API_PREFIX}che/url`)
      .use(errorHandler)
      .end((err, res)=> {
        if (err) {
          return;
        }
        this.setState({cheUrl: res.body.cheUrl});
      });
  },

  render: function () {
    return (
      <div className="input">
        <div className="row">
          <ToastContainer ref={(ref) => {
            this.container = ref;
          }}
                          toastMessageFactory={ToastMessageFactory}
                          className='toast-center text-center col-sm-4'/>
          <div className="col-lg-4">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="请输入邀请码"
                     ref={(ref) => {
                       this.code = ref;
                     }} onFocus={this.clearError}/>
              <div className="input-group-btn">
                <button type="submit" className="btn btn-primary" onClick={this.codeClick}>确定</button>
              </div>
            </div>
            <div
              className={this.state.codeError === '' ? 'hide fa fa-warning warning-icon' : 'fa fa-warning warning-icon red' }>
              {this.state.codeError}
            </div>
          </div>

          <div className="form-actions center col-lg-3">

            <a href="get-invitation-code.html" target="_blank">
              输入邀请码，参与更多Program
            </a>

            {/*<a href={'che.html?cheUrl='+this.state.cheUrl} target="_blank">*/}
            {/*<button type="button" className="btn btn-sm btn-success" disabled={this.state.cheUrl ? '' : 'disabled'}>*/}
            {/*GO IDE*/}
            {/*<i className="ace-icon fa fa-arrow-right icon-on-right bigger-110"></i>*/}
            {/*</button>*/}
            {/*</a>*/}
          </div>
        </div>
      </div>
    )
  }
});

module.exports = JoinProgram;