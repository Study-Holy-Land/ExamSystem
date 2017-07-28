import marked from 'marked';

var BasicBlankQuiz = React.createClass({
  updateAnswer(){
    const userAnswer = this.userAnswer.value.trim() || '';
    this.props.onUpdateAnswer({
      index: this.props.index,
      userAnswer
    });
  },

  render(){
    let desc = this.props.description || '';


    function mark() {
      return {__html: marked(desc)};
    }

    return (
      <div>
        <div className="description" dangerouslySetInnerHTML={mark()}></div>

        <div className="form-group answer">
          <input type="text"
                 className="form-control"
                 ref={(ref) => {
                   this.userAnswer = ref;
                 }}
                 disabled={t}
                 onBlur={this.updateAnswer}/>
        </div>
      </div>
    );
  }
});

module.exports = BasicBlankQuiz;
