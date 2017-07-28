import {Component} from 'react';
import ErrorTip from './error-tip';

export default class BasicBlankQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionError: '',
      answerError: '',
      basicQuiz: {}
    };
  }

  componentDidMount() {
    this.description.value = this.props.basicQuiz.description || '';
    this.answer.value = this.props.basicQuiz.answer || '';
  }

  componentDidUpdate() {
    this.description.value = this.props.basicQuiz.description || '';
    this.answer.value = this.props.basicQuiz.answer || '';
  }

  handleDescriptionError() {
    const description = this.description.value.trim();
    let basicQuiz = this.props.basicQuiz;
    basicQuiz.description = description;
    if (!description) {
      this.setState({
        descriptionError: '描述不能为空',
        basicQuiz
      });
    } else {
      this.setState({
        descriptionError: '',
        basicQuiz
      });
    }
    this.props.updateBasicQuiz(basicQuiz);
  }

  handleAnswerError() {
    const answer = this.answer.value.trim();
    let basicQuiz = this.props.basicQuiz;
    basicQuiz.answer = answer;
    if (!answer) {
      this.setState({
        answerError: '描述不能为空',
        basicQuiz
      });
    } else {
      this.setState({
        answerError: '',
        basicQuiz
      });
    }
    this.props.updateBasicQuiz(basicQuiz);
  }

  render() {
    return (
      <div className='basic-blank-quiz'>
        <form className='form-horizontal'>
          <div className='form-group'>
            <label className='col-sm-2 control-label'>描述</label>
            <div className='col-sm-9'>
              <textarea className='form-control'
                        placeholder='描述'
                        ref={(ref) => {
                          this.description = ref;
                        }}
                        onBlur={this.handleDescriptionError.bind(this)}/>
              <ErrorTip error={this.state.descriptionError}/>
            </div>
          </div>
          <div className='form-group'>
            <label className='col-sm-2 control-label'>答案</label>
            <div className='col-sm-9'>
              <input type='text'
                     className='form-control'
                     placeholder='答案'
                     ref={(ref) => {
                       this.answer = ref;
                     }}
                     onBlur={this.handleAnswerError.bind(this)}/>
              <ErrorTip error={this.state.answerError}/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
