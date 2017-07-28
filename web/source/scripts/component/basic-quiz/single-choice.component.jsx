import marked from 'marked';

var SingleChoice = React.createClass({
  updateAnswer(e){
    const userAnswer = e.target.value.toString() || '';
    this.props.onUpdateAnswer({
      index: this.props.index,
      userAnswer
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
                  <input type="radio" value={index} name={this.props.index}
                         onClick={this.updateAnswer}/>
                  <label className="input-left">{option}</label>
                </div>)
            })
          }
        </div>
      </div>
    );
  }
});

module.exports = SingleChoice;
