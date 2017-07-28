import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import page from 'page';
import {Modal, Button} from 'react-bootstrap';
import nocache from 'superagent-no-cache';
import superAgent from 'superagent';
import errorHandler from '../../../../tools/error-handler.jsx';
import getQueryString from '../../../../tools/getQueryString';
import {homeworkQuizzesStatus} from '../../../../mixin/constant';
import validate from 'validate.js';

const quizId = getQueryString('quizId');
let pollTimeout;
let TIMEOUT = 500000;
const constraint = {
  githubUrl: {
    presence: {message: '^请输入仓库地址'},
    format: {
      pattern: /^(?:https:\/\/)?((?:git\.oschina\.net\/)|(?:github\.com\/))(?:[^ ]+)(?:\/)(?:[^ ]+)$/,
      message: '^仓库地址不正确'
    }
  }
};

function getError (validateInfo, field) {
  if (validateInfo && validateInfo[field] && validateInfo[field].length > 0) {
    return validateInfo[field][0];
  }
  return '';
}

class HomeworkSubmission extends Component {
  constructor (props) {
    super(props);
    this.state = {
      githubUrl: this.props.userAnswerRepo || '',
      githubUrlError: '',
      branch: this.props.branch || 'master',
      submitStatus: 5,
      showFinishModel: false,
      showResult: false,
      runningResult: ''
    };
  }

  componentWillReceiveProps (next) {
    this.setState({
      githubUrl: next.userAnswerRepo,
      branch: next.branch
    });
  }

  checkRepo () {
    if (this.state.githubUrl === '') {
      const result = validate({githubUrl: this.state.githubUrl}, constraint);
      const error = getError(result, 'githubUrl');

      this.setState({githubUrlError: error});
      return error === '';
    }

    return true;
  }

  handleRepoChange (e) {
    const valObj = {githubUrl: e.target.value.trim()};
    const result = validate(valObj, constraint);
    const error = getError(result, 'githubUrl');
    this.setState({
      githubUrl: e.target.value.trim()
    });

    this.setState({githubUrlError: error});
    if (error === '') {
      this.setState(valObj);
    }
  }

  handleBranchChange (e) {
    this.setState({branch: e.target.value.trim()});
  }

  hasTaskProcess () {
    return this.state.submitStatus === homeworkQuizzesStatus.PROGRESS;
  }

  pollData () {
    if (this.hasTaskProcess()) {
      pollTimeout = setTimeout(this.onInit(), TIMEOUT);
    } else {
      pollTimeout && clearTimeout(pollTimeout);
      if (this.state.submitStatus === 4) {
        this.checkHomeworkProcess();
      }
    }
  }

  onInit () {
    superAgent.get(`${API_PREFIX}quiz/${quizId}`)
      .set('Content-Type', 'application/json')
      .use(nocache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({submitStatus: res.body.status, runningResult: res.body.result}, () => {
          this.pollData();
        });
      });
  }

  handleReturnClick () {
    page('paper-list.html');
  }

  showFinishMessage () {
    this.setState({showFinishModel: true});
  }

  checkHomeworkProcess () {
    const sections = this.props.paperInfo.sections;
    sections.forEach((section, index) => {
      const quiz = section.quizzes.find(quiz => quiz._id === quizId);

      if (section.quizzes.indexOf(quiz) === section.quizzes.length - 1) {
        if (index === sections.length - 1) {
          this.showFinishMessage();
          return;
        } else {
          const currentQuizId = sections[index + 1].quizzes[0]._id;
          page(`quiz.html?&quizId=${currentQuizId}`);
        }
      }
    });
  }

  handleSubmit () {
    if (this.state.githubUrlError || !this.checkRepo()) {
      return;
    }

    const data = {
      userAnswerRepo: this.state.githubUrl,
      branch: this.state.branch,
      commitSHA: ''
    };
    const jsonData = Object.assign({
      quizId,
      homeworkQuizUri: this.props.uri
    }, data);

    superAgent.post(API_PREFIX + 'quiz/scoring')
      .set('Content-Type', 'application/json')
      .use(nocache)
      .use(errorHandler)
      .send(jsonData)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        this.setState({submitStatus: res.body.status, showResult: true}, () => {
          this.onInit();
        });
      });
  }

  getSubmitable () {
    const submitableStatus = [
      homeworkQuizzesStatus.ERROR,
      homeworkQuizzesStatus.ACTIVE
    ];

    let submitable = submitableStatus.some((val) => {
      return (this.state.submitStatus) === val;
    });

    if (this.props.status === homeworkQuizzesStatus.SUCCESS) {
      submitable = false;
    }

    return submitable;
  }

  getTemplateRepoHtml () {
    return (
      <div className='form-group'>
        <label className='col-sm-2 control-label'>编程题模板库地址</label>
        <div className='col-sm-8 template-repo-link'>
          <a href={this.props.templateRepo} rel='noopener noreferrer' target='_blank'>{this.props.templateRepo}</a>
        </div>
      </div>
    );
  }

  getSubmitHtml (submitable) {
    return (
      <div className='form-group'>
        <label className='col-sm-2 control-label' />
        <div className='col-sm-4'>
          <button className='btn btn-block btn-primary submit-button'
              disabled={submitable ? '' : 'disabled'}
              onClick={this.handleSubmit.bind(this)}
          >
            提交代码地址
          </button>
        </div>
      </div>
    );
  }

  getRunningResult () {
    const resultClass = this.state.showResult ? '' : 'hide';
    const spinner = this.state.submitStatus === 3 ? <i className='fa fa-spinner fa-pulse fa-3x fa-fw' /> : '';

    return (<div className={'running-result ' + resultClass}>
      <div className='result'>
        <label>运行结果为:</label>
        <div className='result-content'>
          {this.state.runningResult}
          <br />
          {spinner}
        </div>
      </div>
    </div>);
  }

  render () {
    const submitable = this.getSubmitable();

    return (<div className='tab'>
        <div className='submit-quiz-form'>
          <div className='row last-time' />
          <div className='form-horizontal'>
            {this.getTemplateRepoHtml()}
            <div className='form-group'>
              <label htmlFor='githubUrl' className='col-sm-2 control-label'>git仓库地址</label>
              <div className='col-sm-8'>
                <input type='text'
                    className='form-control'
                    ref='githubUrl'
                    value={this.state.githubUrl}
                    placeholder='仅支持github，例：https://github.com/abc/def'
                    disabled={submitable ? false : 'disabled'}
                    onChange={this.handleRepoChange.bind(this)}
                />
                <div ref='error' className={'lose' + (this.state.githubUrlError === '' ? ' hide' : '')}>
                  {this.state.githubUrlError}
                </div>

              </div>
            </div>
            <div className='form-group'>
              <label className='col-sm-2 control-label'>git仓库分支</label>
              <div className='col-sm-8'>
                <input ref='branch'
                    className='form-control'
                    type='text'
                    placeholder='请输入分支,不填将默认为master'
                    value={this.state.branch}
                    disabled={submitable ? false : 'disabled'}
                    onChange={this.handleBranchChange.bind(this)}
                />
              </div>
            </div>
            {this.getSubmitHtml(submitable)}
          </div>

          <div className={this.state.showFinishModel ? '' : 'hidden'}>
            <div className='static-modal'>
              <Modal.Dialog>
                <Modal.Header>
                  <Modal.Title>您已完成该试卷</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  点击确定，回到试卷列表
                </Modal.Body>

                <Modal.Footer>
                  <Button bsStyle='primary' onClick={(e) => this.handleReturnClick(e)}>确定</Button>
                </Modal.Footer>

              </Modal.Dialog>
            </div>
          </div>
        </div>
        {this.getRunningResult()}
      </div>
    );
  }
}

HomeworkSubmission.propTypes = {
  paperInfo: PropTypes.object.isRequired
};

const mapStateToProps = ({quiz}) => {
  return {paperInfo: quiz.paperInfo};
};

export default connect(mapStateToProps, () => {
  return {};
})(HomeworkSubmission);
