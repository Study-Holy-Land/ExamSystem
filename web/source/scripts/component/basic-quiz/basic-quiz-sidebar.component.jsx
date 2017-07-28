var Reflux = require('reflux');
var Modal = require('react-bootstrap/lib/Modal');
var page = require('page');
var BasicQuizStore = require('../../store/basic-quiz/basic-quiz-store');
var BasicQuizActions = require('../../actions/basic-quiz/basic-quiz-actions');

var BasicQuizSidebar = React.createClass({
  mixins: [Reflux.connect(BasicQuizStore)],

  getInitialState: function () {
    return {
      loading: false,
      isShow: false
    };
  },

  hideModal() {
    this.setState({isShow: false});
  },

  showModal() {
    this.setState({isShow: true});
  },

  submitAnswer(){
    this.setState({
      loading: true
    });

    BasicQuizActions.submitAnswer({
      quizzes: this.props.quizzes,
      programId: this.props.programId,
      paperId: this.props.paperId
    });
  },

  backDashboard(){
    page(`dashboard.html?programId=${this.props.programId}&paperId=${this.props.paperId}`)
  },

  render() {
    return (
      <div className="sidebar">
        <div className="title">
          <div>
            <h2>简单客观题</h2>
          </div>
          <p>请仔细阅读内容，并在规定的时间段内答完题目</p>

        </div>

        <div className="text-center">
          <h4>共有 {this.props.quizzes ? this.props.quizzes.length : ''} 道题</h4>
        </div>

        <div className="confirm">
          <button className="btn btn-lg btn-danger btn-block"
                  onClick={this.showModal}>提交答案
          </button>
          <button className="btn btn-lg btn-success btn-block"
                  onClick={this.backDashboard}>返回试卷
          </button>
        </div>
        <div className="static-modal">
          <Modal show={this.state.isShow} onHide={this.hideModal}>
            <Modal.Header closeButton>
              <Modal.Title>注意!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <b>您确定要交卷么?一旦提交将无法继续修改!</b>
              <Modal.Footer>
                <button className="btn btn-danger submit" onClick={this.submitAnswer}
                        disabled={this.state.loading ? 'disabled' : ''}>确认提交
                  <i className={'fa fa-spinner fa-spin' + (this.state.loading ? '' : ' hide')}/>
                </button>
                <button className="btn btn-default" onClick={this.hideModal}>关闭</button>
              </Modal.Footer>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
});

module.exports = BasicQuizSidebar;
