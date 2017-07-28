import {Component} from 'react';
import superagent from 'superagent';
import ErrorTip from './error-tip';

export default class BasicQuizEditorFoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      submitState: ''
    };
  }

  checkBasicBlankQuiz({description, answer}) {
    if (description && answer) {
      return true;
    }
    return false;
  }

  checkChoice({options, description, answer}) {
    let item = options.find((item) => item === '');
    if (item === undefined && description && answer) {
      return true;
    }
    return false;
  }

  check() {
    let basicQuiz = this.props.basicQuiz;
    let result = [];
    if (basicQuiz.length === 0) {
      return {text: '提交数据未填写完整', result: []};
    }
    basicQuiz.forEach((quiz, index) => {
      let quizError;
      if (quiz.type === 'BASIC_BLANK_QUIZ') {
        quizError = this.checkBasicBlankQuiz(quiz);
      } else {
        quizError = this.checkChoice(quiz);
      }
      quizError ? '' : result.push((index + 1));
    });
    if (result.length === 0) {
      return {text: '', result};
    }
    return {text: ' 未填写完整', result};
  }

  submitBasicQuiz() {
    let {text, result} = this.check();
    let error = result.toString() + text;
    this.props.updateErrors(result);
    this.setState({
      error: result.length ? '' : error,
      submitState: error.trim() ? '' : 'fa fa-spinner fa-spin'
    }, () => {
      if (!error.trim()) {
        superagent
          .post(API_PREFIX + '/basic-quizzes')
          .send({basicQuiz: this.props.basicQuiz})
          .end((err, res) => {
            if (err) {
              throw (err);
            } else {
              this.setState({
                submitState: ''
              });
            }
          });
      }
    });
  }

  render() {
    return (
      <div className='btn-group btn-group-justified tab-padding'>
        <div className='btn-group' role='group'>
          <button type='button' className='editor-foot btn btn-primary'
                  disabled={this.state.submitState ? 'disabled' : ''}
                  onClick={this.submitBasicQuiz.bind(this)}>确定
            <i className={this.state.submitState}></i>
          </button>
          <ErrorTip error={this.state.error}/>
        </div>
      </div>
    );
  }
}
