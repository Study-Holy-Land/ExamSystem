'use strict';

var Reflux = require('reflux');
var validate = require('validate.js');
var constant = require('../../../../mixin/constant');
var homeworkQuizzesStatus = require('../../../../mixin/constant').homeworkQuizzesStatus;
var HomeworkActions = require('../../actions/homework/homework-actions');
var SubmissionIntroductionStore = require('../../store/homework/submission-introduction-store');

var constraint = {
  githubUrl: {
    presence: {message: '^请输入仓库地址'},
    format: {
      pattern: /^(?:https\:\/\/)?(?:github\.com\/)(?:[^ ]+)(?:\/)(?:[^ ]+)$/,
      message: '^仓库地址不正确'
    }
  }
};

function getError(validateInfo, field) {
  if (validateInfo && validateInfo[field] && validateInfo[field].length > 0) {
    return validateInfo[field][0];
  }
  return '';
}

var SubmissionIntroduction = React.createClass({
  mixins: [Reflux.connect(SubmissionIntroductionStore)],

  getInitialState: function () {
    return {
      'githubUrlError': ''
    }
  },

  handleSubmit: function () {
    var repo = this.refs.githubUrl.value.trim();
    var valObj = {
      'githubUrl': repo
    };
    var result = validate(valObj, constraint);
    this.state.githubUrlError = getError(result, 'githubUrl');
    this.forceUpdate();

    if (this.state.githubUrlError) {
      return;
    }

    if (!this.props.quiz.branch) {
      this.props.onBranchUpdate('master');
    }

    HomeworkActions.createTask({
      userAnswerRepo: this.props.quiz.userAnswerRepo,
      branch: this.props.quiz.branch || 'master',
      commitSHA: ""
    });
  },

  handleBranchChange: function (evt) {
    var branch = evt.target.value.trim();
    this.props.onBranchUpdate(branch);
  },

  handleRepoChange: function (evt) {
    var repo = evt.target.value.trim();
    this.props.onRepoUpdate(repo);

    var valObj = {
      'githubUrl': repo
    };

    var result = validate(valObj, constraint);
    var error = getError(result, 'githubUrl');
    var stateObj = {
      'githubUrlError': error
    };

    this.setState(stateObj);
  },

  render() {
    var submitableStatus = [
      homeworkQuizzesStatus.ERROR,
      homeworkQuizzesStatus.ACTIVE
    ];

    var submitable = submitableStatus.some((val) => {
      return this.props.quiz.status === val
    });

    return (
      <div className="tab">
        <div>
          <div className="row last-time">
          </div>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="col-xs-2 control-label">编程题模板库地址</label>
              <div className="col-xs-8">
                <label className="form-control">{this.props.templateRepo || "本题没有模板地址"}</label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="githubUrl" className="col-sm-2 control-label">git仓库地址</label>
              <div className="col-sm-8">
                <input type="text"
                       className="form-control"
                       ref="githubUrl"
                       onChange={this.handleRepoChange}
                       value={this.props.quiz.userAnswerRepo}
                       placeholder="仅支持github，例：https://github.com/abc/def"
                       disabled={submitable ? '' : 'disabled'}/>

                <div ref="error" className={'lose' + (this.state.githubUrlError === '' ? ' hide' : '')}>
                  {this.state.githubUrlError}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">git仓库分支</label>
              <div className="col-sm-8">
                <input ref="branch"
                       className="form-control"
                       type="text"
                       onChange={this.handleBranchChange}
                       value={this.props.quiz.branch}
                       disabled={submitable ? '' : 'disabled'}
                       placeholder="请输入分支,不填将默认为master"/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label"/>
              <div className="col-sm-4">
                <button className="btn btn-block btn-primary"
                        disabled={this.props.quiz.status === constant.homeworkQuizzesStatus.SUCCESS ||
                        this.props.quiz.status === constant.homeworkQuizzesStatus.PROGRESS ? 'disabled' : ''}
                        onClick={this.handleSubmit}>
                  提交代码地址
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SubmissionIntroduction;
