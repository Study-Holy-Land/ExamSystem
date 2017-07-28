import {Component} from 'react';
import ErrorTip from './error-tip';

export default class BasicBlankQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index,
      descriptionError: '',
      answerError: ''
    };
  };

  setRefValue() {
    if (this.props.index === -1) {
      this.description.value = '';
      this.answer.value = '';
    } else {
      this.description.value = this.props.basicQuiz[this.props.index].description || '';
      this.answer.value = this.props.basicQuiz[this.props.index].answer || '';
    }
  }

  componentDidUpdate() {
    this.setRefValue();
  }

  componentDidMount() {
    this.setRefValue();
  }

  updateDescription(index) {
    const description = this.description.value.trim();
    if (!description) {
      this.setState({
        descriptionError: '题目描述不能为空'
      });
    } else {
      this.setState({
        descriptionError: ''
      });
    }
    let basicQuiz = this.props.basicQuiz[this.props.index];
    basicQuiz.description = description;
    this.props.updateQuiz({index, quiz: basicQuiz});
  }

  updateAnswer(index) {
    const answer = this.answer.value.trim();
    if (!answer) {
      this.setState({
        answerError: '题目答案不能为空'
      });
    } else {
      this.setState({
        answerError: ''
      });
    }
    let basicQuiz = this.props.basicQuiz[this.props.index];
    basicQuiz.answer = answer;
    this.props.updateQuiz({index, quiz: basicQuiz});
  }

  cleanDescription() {
    this.setState({
      descriptionError: ''
    });
  }

  cleanAnswer() {
    this.setState({
      answerError: ''
    });
  }

  render() {
    const index = this.props.index;

    return (
      <div className='basic-blank-quiz'>
        <form className='form-horizontal'>
          <div className='form-group'>
            <label className='col-sm-3 control-label'>描述</label>
            <div className='col-sm-9'>
              <textarea className='form-control'
                        placeholder='描述'
                        ref={(ref) => {
                          this.description = ref;
                        }}
                        onBlur={this.updateDescription.bind(this, index)}
                        onFocus={this.cleanDescription.bind(this)}/>
              <ErrorTip error={this.state.descriptionError}/>
            </div>
          </div>
          <div className='form-group'>
            <label className='col-sm-3 control-label'>答案</label>
            <div className='col-sm-9'>
              <input type='text'
                     className='form-control'
                     placeholder='答案'
                     ref={(ref) => {
                       this.answer = ref;
                     }} onBlur={this.updateAnswer.bind(this, index)}
                     onFocus={this.cleanAnswer.bind(this)}/>
              <ErrorTip error={this.state.answerError}/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
