import marked from 'marked';
import {Component} from 'react';

export default class SingleChoice extends Component {
  constructor (props) {
    super(props);
    this.state = {
      userAnswer: this.props.userAnswer ? this.props.userAnswer.userAnswer : ''
    };
  }

  componentWillReceiveProps (next) {
    this.state = {
      userAnswer: next.userAnswer
    };
  }

  updateAnswer (e) {
    const userAnswer = e.target.value.toString() || '';
    this.state = {
      userAnswer: userAnswer
    };
    this.props.onUpdateAnswer({
      index: this.props.index,
      userAnswer
    });
  }

  render () {
    var options = this.props.options || [];
    let desc = this.props.description || '';

    function mark () {
      var reg = /<video (.*)><\/video>/g;
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
                  <input
                      type='radio'
                      value={index}
                      disabled={this.props.disabled}
                      name={this.props.index}
                      onClick={this.updateAnswer.bind(this)}
                      checked={parseInt(this.state.userAnswer) === index}
                  />
                  <label className='input-left'>{option}</label>
                </div>);
            })
          }
        </div>
      </div>
    );
  }
};

