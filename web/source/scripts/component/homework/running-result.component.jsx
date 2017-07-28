'use strict';

var RunningResult = React.createClass({

  componentDidUpdate(){
    this.runningResult.scrollTop = this.runningResult.scrollHeight;
  },

  render() {
    var resultText = this.props.quiz.result;
    var status = this.props.quiz.status;
    var spinner = status === 3 ? <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> : '';

    return (
      <div className="runningResult tab">
        <div className="result">
          <label>运行结果为:</label>
          <div className="content" ref={(ref) => {
            this.runningResult = ref;
          }}>
            {resultText}
            <br/>
            {spinner}
          </div>
        </div>

      </div>
    );
  }
});

module.exports = RunningResult;