import marked from 'marked';

var MultipleChoice = React.createClass({
  getInitialState: function () {
    return {
      userAnswer: []
    };
  },

  updateAnswer(e){
    const userAnswer = this.state.userAnswer;
    let answer;
    const value = e.target.value.toString();
    if (e.target.checked) {
      userAnswer.push(value);
      answer = userAnswer;
    } else {
      answer = userAnswer.filter(item=>item !== value);
    }
    this.setState({
      userAnswer: answer
    }, ()=> {
      this.props.onUpdateAnswer({
        index:this.props.index,
        userAnswer: this.state.userAnswer.toString()
      });
    });
  },

  render(){
    var options = this.props.options || [];
    let desc = this.props.description || '';

    function mark() {
      return {__html: marked(desc)};
    }

    return (
      <div>
        <div className="description" dangerouslySetInnerHTML={mark()}></div>

        <div className="form-group">
          {
            options.map((option, index) => {
              return (
                <div key={index} className="answer-radio">
                  <input type="checkbox" value={index} onClick={this.updateAnswer}/>
                  <label className="input-left">{option}</label>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
});

module.exports = MultipleChoice;
