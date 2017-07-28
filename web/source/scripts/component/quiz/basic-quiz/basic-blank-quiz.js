import marked from 'marked';
import {Component} from 'react';
export default class BasicBlankQuiz extends Component {
  constructor (props) {
    super(props);
    this.state = {
      userAnswer: this.props.userAnswer ? this.props.userAnswer.userAnswer : ''
    };
  }

  componentWillReceiveProps (next) {
    this.state = {
      userAnswer: next.userAnswer || ''
    };
  }

  updateAnswer () {
    const userAnswer = this.userAnswer.value.trim() || '';
    this.props.onUpdateAnswer({
      index: this.props.index,
      userAnswer
    });
  }

  render () {
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

        <div className='form-group answer'>
          <input type='text'
              className='form-control'
              value={this.state.userAnswer}
              ref={(ref) => {
                this.userAnswer = ref;
              }}
              disabled={this.props.disabled}
              onChange={(e) => {
                this.setState({
                  userAnswer: e.target.value
                });
              }}
              onBlur={this.updateAnswer.bind(this)}
          />
        </div>
      </div>
    );
  }
};

