import {Component} from 'react';
import request from 'superagent';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import validate from 'validate.js';
import '../../style/common.less';
import '../../style/homework-edit.less';
import HomeworkStacks from './HomeworkStacks';
import constant from '../../../mixin/constant';

const ErrorFrame = ({errorName, content}) => (
    <div className={'row no-margin-left-right warning' + (content.state[errorName] ? '' : ' warning-hidden')}>
      <div className='col-xs-12'>
        <i className='fa fa-warning warning-icon'> </i>
        <span>{content.state[errorName]}</span>
      </div>
    </div>
);

let pollTimeout;

class CreatedHomework extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeError: '',
      nameError: '',
      definitionRepoError: '',
      status: 3,
      result: '排队中...',
      title: '新建试题',
      stackId: 1,
      isSucceed: false,
      isFailed: false,
      isExistGithubToken: true
    };
  }

  componentDidMount() {
    if (this.props.params.id) {
      this.setState({title: '修改试题'});
      request
        .get(API_PREFIX + `/homework-definitions/status/${this.props.params.id}`)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          if (res.body.data) {
            let {stackId, name, definitionRepo, status, result} = res.body.data;
            this.name.value = name;
            this.definitionRepo.value = definitionRepo;
            this.setState({
              stackId,
              result,
              status
            });
          } else {
            this.setState({
              status: 0
            });
          }
        });
    }
  }

  componentDidUpdate() {
    this.runningResult.scrollTop = this.runningResult.scrollHeight;
  }

  onInit() {
    if (this.props.params.id) {
      this.setState({title: '修改试题'});
      request
          .get(API_PREFIX + `/homework-definitions/status/${this.props.params.id}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            if (res.body.data) {
              let {stackId, name, definitionRepo, status, result} = res.body.data;
              this.name.value = name;
              this.definitionRepo.value = definitionRepo;
              this.setState({
                stackId,
                result,
                status,
                isSucceed: status === 2,
                isFailed: status === 0
              });
            } else {
              this.setState({
                status: 0
              });
            }
            this.pollData();
          });
    }
  }

  hasTaskProcess() {
    return this.state.status === 1;
  }

  pollData() {
    if (this.hasTaskProcess()) {
      pollTimeout = setTimeout(this.onInit(), 5000);
    } else {
      pollTimeout && clearTimeout(pollTimeout);
    }
  }

  onValueChange(id) {
    this.setState({
      stackId: id
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const stackId = this.state.stackId;
    const name = this.name.value;
    const definitionRepo = this.definitionRepo.value;

    if (this.validateInput()) {
      this.setState(this.validateInput);
    } else {
      this.setState({
        status: 1
      });
      if (this.props.params.id) {
        this.setState({status: 1});
        request
            .put(API_PREFIX + `/homework-definitions/${this.props.params.id}`)
            .send({
              stackId,
              name,
              definitionRepo
            })
            .end((err, res) => {
              if (res.status !== constant.httpCode.NO_CONTENT) {
                this.setState({status: 0, isFailed: true});
                throw err;
              }
              this.pollData();
            });
      } else {
        this.setState({status: 1});
        request
            .post(API_PREFIX + '/homework-definitions')
            .set('Content-Type', 'application/json')
            .send({
              stackId,
              name,
              definitionRepo
            })
            .end((err, res) => {
              if (err) {
                throw err;
              } else if (res.body.status === constant.httpCode.BAD_REQUEST) {
                this.setState({
                  status: 3,
                  nameError: '题目名已存在，请换一个'
                });
              } else if (res.body.status === constant.httpCode.NOT_FOUND) {
                this.setState({
                  status: 3,
                  isExistGithubToken: false
                });
              } else if (res.status === constant.httpCode.CREATED) {
                this.props.router.push(URI_PREFIX + `/homeworks/${res.body.id}/edit`);
              } else {
                this.setState({
                  status: 0,
                  isFailed: true
                });
              }
              this.pollData();
            }
            );
      }
    }
  }

  onFocus(err) {
    var errObj = {};
    errObj[err] = '';

    this.setState(errObj);
  }

  goToLists() {
    this.props.router.push(URI_PREFIX + '/homeworks');
  }

  continueAddHomework() {
    this.setState({status: 3, title: '新建试题'});
    this.name.value = '';
    this.definitionRepo.value = '';
    this.props.router.push(URI_PREFIX + '/homeworks/new');
  }

  validateInput() {
    const constraints = {
      stackId: {
        presence: {
          message: '^技术栈不能为空'
        }
      },
      name: {
        presence: {
          message: '^题目名称不能为空'
        }
      },
      definitionRepo: {
        presence: {
          message: '^仓库地址不能为空'
        },
        format: {
          pattern: /^(?:https:\/\/)?(?:github\.com\/)(?:[^ ]+)(?:\/)(?:[^ ]+)$/,
          message: '^仓库地址不正确'
        }
      }

    };

    const stackId = this.state.stackId;
    const name = this.name.value;
    const definitionRepo = this.definitionRepo.value;
    const errorInputMessage = validate({stackId, name, definitionRepo}, constraints);
    const validateResult = {};

    for (let key in errorInputMessage) {
      validateResult[key + 'Error'] = errorInputMessage[key][0];
    }
    return errorInputMessage ? validateResult : undefined;
  }

  judgeStatusPending() {
    return this.state.status === 1 ? '  pedding-status' : '';
  }

  judgeStatusWarningMessage() {
    return this.state.status === 1 ? '' : ' warning-message';
  }

  render() {
    return (
        <div id='homework-editor'>
          <div className='table-header'>
            {this.state.title}
          </div>
          <div className='table-body no-padding'>
            <HomeworkStacks defaultStackId={this.state.stackId}
                            status={this.state.status} onValueChange={this.onValueChange.bind(this)}/>

            <div className='row no-margin-left-right form-group'>
              <div className='col-sm-3 text-right'><label>题目名称</label></div>
              <div className='col-sm-6'><input className='form-control name-input'
                                               disabled={this.state.status === 1}
                                               ref={(ref) => {
                                                 this.name = ref;
                                               }}
                                               onFocus={this.onFocus.bind(this, 'nameError')}
              />

                <ErrorFrame errorName='nameError' content={this}/>
              </div>
            </div>

            <div className='row no-margin-left-right form-group'>
              <div className='col-sm-3 text-right'><label>仓库地址</label></div>
              <div className='col-sm-6'><input className='form-control address-input'
                                               disabled={this.state.status === 1}
                                               ref={(ref) => {
                                                 this.definitionRepo = ref;
                                               }}
                                               onFocus={this.onFocus.bind(this, 'definitionRepoError')}
              />
                <div
                    className={this.state.isExistGithubToken ? 'hide fa fa-warning warning-icon warning' : 'fa fa-warning warning-icon warning'}>
                  不存在githubToken,不能出题
                </div>

                <ErrorFrame errorName='definitionRepoError' content={this}/>
              </div>
            </div>

            <div className='row no-margin-left-right form-group'>
              <div className='col-sm-6 col-sm-offset-3'>
                <button
                    className={'btn btn-white btn-primary form-control' + (this.judgeStatusPending())}
                    disabled={this.state.status === 1} onClick={this.onSubmit.bind(this)}>确定 <i
                    className={'fa fa-spinner fa-spinner fa-spin' + (this.judgeStatusWarningMessage())}></i>
                </button>
              </div>
            </div>
            <div
                className={'row no-margin-left-right form-group' + (this.state.isSucceed ? '' : ' warning-message')}>
              <div className='alert alert-block alert-success col-sm-6 col-sm-offset-3 no-margin-bottom'>
                <p className='message-hint'>
                  <i className='ace-icon fa fa-check-circle icon-space'> </i>
                  试题添加成功,请选择查看试题列表还是继续添加试题?
                </p>
                <button className='btn btn-sm btn-success icon-space' onClick={this.goToLists.bind(this)}>查看试题列表
                </button>
                <button className='btn btn-sm' onClick={this.continueAddHomework.bind(this)}>继续添加试题</button>
              </div>
            </div>

            <div
                className={'row no-margin-left-right form-group' + (this.state.isFailed ? '' : ' warning-message')}>
              <div className='alert alert-block alert-danger col-sm-6 col-sm-offset-3 no-margin-bottom'>
                <p className='message-hint'>
                  <i className='fa fa-times-rectangle '> </i>
                  {this.state.result},试题添加失败，请选择查看试题列表还是重新添加试题
                </p>
                <button className='btn btn-sm btn-danger  icon-space' onClick={this.goToLists.bind(this)}>查看试题列表
                </button>
                <button className='btn btn-sm' onClick={this.continueAddHomework.bind(this)}>重新添加试题</button>
              </div>
            </div>

            <div className={'row ' + (this.state.status === 1 ? '' : 'warning-message')}>
              <div className='add-homework-result col-sm-8 col-sm-offset-2' ref={(ref) => {
                this.runningResult = ref;
              }}>
                {this.state.result}
                <br/>
                <i className='fa fa-spinner fa-pulse fa-3x fa-fw'></i>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default connect(() => {
  return {};
})(withRouter(CreatedHomework));
