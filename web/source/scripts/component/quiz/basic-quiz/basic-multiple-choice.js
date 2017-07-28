import marked from 'marked';
import {Component} from 'react';

export default class MultipleChoice extends Component {
  constructor (props) {
    super(props);
    this.state = {
      userAnswer: this.props.userAnswer ? this.props.userAnswer.userAnswer.split(',') : []
    };
  }

  componentWillReceiveProps (next) {
    this.state = {
      userAnswer: next.userAnswer ? next.userAnswer.split(',') : []
    };
  }

  updateAnswer (e) {
    const userAnswer = this.state.userAnswer;
    let answer;
    const value = e.target.value.toString();
    if (e.target.checked) {
      userAnswer.push(value);
      answer = userAnswer;
    } else {
      answer = userAnswer.filter(item => item !== value);
    }
    this.setState({
      userAnswer: answer
    }, () => {
      this.props.onUpdateAnswer({
        index: this.props.index,
        userAnswer: this.state.userAnswer.toString()
      });
    });
  }

  render () {
    var options = this.props.options || [];
    let desc = this.props.description || '';

    function mark () {
      var reg = /<iframe (.*)><\/iframe>/g;
      var video = desc.match(reg) || [];
      var descArray = desc.split(reg);
      var markedDescArray = descArray.map(des => (marked(des)));
      return {__html: `${markedDescArray[0] || ''} ${video[0] || ''} ${markedDescArray[2] || ''}`};
    }

    return (
      <div>
        <div className='description' dangerouslySetInnerHTML={mark()} />

        <div className='form-group'>
          {
            options.map((option, index) => {
              return (
                <div key={index} className='answer-radio'>
                  <input type='checkbox'
                      disabled={this.props.disabled}
                      value={index}
                      onClick={this.updateAnswer.bind(this)}
                      checked={this.state.userAnswer.some(id => id === index + '')}
                  />
                  <label className='input-left'>{option}</label>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
};
