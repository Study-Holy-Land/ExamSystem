'use strict';

var Reflux = require('reflux');
var LogicPuzzleStore = require('../../store/logic-puzzle/logic-puzzle-store');
var LogicPuzzleActions = require('../../actions/logic-puzzle/logic-puzzle-actions');
var Modal = require('react-bootstrap/lib/Modal');
var constant = require('../../../../mixin/constant');
var page = require('page');
var getQueryString = require('../../../../tools/getQueryString');
var able = false;
var temp = 0;

var LogicPuzzleSidebar = React.createClass({
  mixins: [Reflux.connect(LogicPuzzleStore)],

  getInitialState: function () {
    return {
      loading: false,
    };
  },

  submitPaper: function () {
    this.setState({
      loading: true
    });
    LogicPuzzleActions.submitPaper(this.state.programId, this.state.paperId);
  },

  backDashboard: function () {
    page(`dashboard.html?programId=${this.state.programId}&paperId=${this.state.paperId}`)
  },

  render: function () {
    var isLast = this.state.orderId === (this.state.itemsCount - 1);
    if (isLast) {
      able = true;
    }
    if (this.state.disableSubmit){
      able = false
    }
    if (this.state.itemsCount !== undefined) {
      temp = this.state.itemsCount;
    } else {
      this.state.itemsCount = temp;
    }
    return (
      <div className="sidebar">
        <div className="description">
          <h2>逻辑题</h2>

          <p>
            请仔细阅读内容，并在规定的时间段内答完题目
          </p>
        </div>

        <div className="tip">

          {this.props.children}

          <p className="finish-rate">
            当前第{this.state.orderId + 1}题共{this.state.itemsCount}题
          </p>
        </div>

        <hr/>

        <div className={able ? 'prompt' : 'hint'}>
          <span>{able ? '检查完毕后可以交卷' : '只有在查看完所有题后才可以交卷'}</span>
        </div>
        <div className="back">
        </div>
        <div className="confirm">
          <a href="#" className="btn btn-lg btn-danger btn-block" data-toggle="modal"
             data-target={able ? '#submitModal' : ''} disabled={able ? '' : 'disabled'}>交卷</a>
          <a className="btn btn-lg btn-success btn-block" onClick={this.backDashboard}>返回试卷</a>
        </div>

        <div className="modal fade bs-example-modal-sm" id="submitModal" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-sm" role="document" aria-hidden="true">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
                <h3 className="modal-title" id="submitModalLabel">注意!</h3>
              </div>
              <div className="modal-body">
                <b>您确定要交卷么?一旦提交将无法继续修改!</b>

                <div className="modal-footer">
                  <button className="btn btn-danger submit" onClick={this.submitPaper}
                          disabled={this.state.loading ? 'disabled' : ''}>确认提交
                    <i className={'fa fa-spinner fa-spin' + (this.state.loading ? '' : ' hide')}/>
                  </button>
                  <button className="btn btn-default" data-dismiss="modal">关闭</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>


    );
  }
});

module.exports = LogicPuzzleSidebar;
