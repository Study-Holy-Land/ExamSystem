'use strict';

var Reflux = require('reflux');
var LogicPuzzleActions = require('../../actions/logic-puzzle/logic-puzzle-actions');
var LogicPuzzleStore = require('../../store/logic-puzzle/logic-puzzle-store');
var _newOrderId;
var getQueryString = require('../../../../tools/getQueryString');

var questionId = getQueryString('questionId');

var temp = 0;
var LogicPuzzleAnswerSubmit = React.createClass({
  mixins: [Reflux.connect(LogicPuzzleStore)],

  getInitialState: function () {
    return {
      submitLoad: false,
      item: '',
      lastLoad: false,
      nextLoad: false
    };
  },

  submitAnswer: function () {
    var answer = this.state.userAnswer;
    if (answer !== null && answer !== '') {
      var newOrderId = this.state.orderId < this.state.itemsCount - 1 ?
      this.state.orderId + 1 :
        this.state.orderId;
      this.setState({
        submitLoad: true
      });
      LogicPuzzleActions.submitAnswer(newOrderId);
    } else {
      $('#warningModal').modal('show');
    }
  },

  handleAnswerChange: function (evt) {
    var val = evt.target.value;
    LogicPuzzleActions.changeAnswer(val);
  },

  previous: function () {
    if (this.state.orderId > 0) {
      _newOrderId = this.state.orderId - 1;
    }
    this.setState({
      lastLoad: true
    });
    LogicPuzzleActions.submitAnswer("previous", _newOrderId);
  },

  next: function () {
    if (this.state.orderId < this.state.itemsCount - 1) {
      _newOrderId = this.state.orderId + 1;
    }
    this.setState({
      nextLoad: true
    });
    LogicPuzzleActions.submitAnswer("next", _newOrderId);
  },

  render: function () {

    if (this.state.itemsCount !== undefined) {
      temp = this.state.itemsCount;
    } else {
      this.state.itemsCount = temp;
    }

    var isFirst = this.state.orderId === 0;
    var isLast = this.state.orderId === (this.state.itemsCount - 1);

    return (
      <div>
        <div className="answer-submit">
          <div className="row">
            <div className="col-md-3 col-sm-3 col-xs-3 result-text">
              <button type="button" className="btn btn-warning" name="button"
                      disabled={isFirst || this.state.lastLoad ? 'disabled' : ''}
                      onClick={isFirst ? '' : this.previous}>上一题
                <i className={'fa fa-spinner fa-spin' + (this.state.lastLoad ? '' : ' hide')}/>
              </button>
            </div>
            <div className="col-md-1 col-sm-1 col-xs-1 result">
              <label htmlFor="result">结果:</label>
            </div>
            <div className="col-md-5 col-sm-5 col-xs-5">
              <input type="number" className="col-md-10 col-sm-10 col-xs-10 form-control" id="result" ref="answer"
                     disabled={(this.state.isExample || this.state.disableSubmit) ? 'disabled' : ''}
                     value={this.state.userAnswer} onChange={this.handleAnswerChange}/>
            </div>
            <div className="col-md-3 col-sm-3 col-xs-3">
              <button type="button" className="btn btn-warning" name="button"
                      disabled={isLast || this.state.nextLoad ? 'disabled' : ''} onClick={isLast ? '' : this.next}>下一题
                <i className={'fa fa-spinner fa-spin' + (this.state.nextLoad ? '' : ' hide')}/>
              </button>
            </div>
          </div>
        </div>

        <div className="modal fade bs-example-modal-sm" id="warningModal" tabIndex="-1" role="dialog" ref="warning">
          <div className="modal-dialog modal-sm" role="document" aria-hidden="true">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
                <h3 className="modal-title" id="waringModalLabel">注意!</h3>
              </div>
              <div className="modal-body">
                <b>提交答案不能为空!</b>

                <div className="modal-footer">
                  <a className="btn btn-default" data-dismiss="modal">关闭</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


});

module.exports = LogicPuzzleAnswerSubmit;
