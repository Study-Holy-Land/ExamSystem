import {Component} from 'react';
import MultipleChoiceOption from './multiple-choice-option';
import ErrorTip from './error-tip';

export default class MultipleChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionError: ''
    };
  }

  componentDidMount() {
    this.description.value = this.props.basicQuiz.description || '';
  }

  handleDescriptionError() {
    const description = this.description.value.trim();
    const basicQuiz = this.props.basicQuiz;
    basicQuiz.description = description;
    if (!description) {
      this.setState({
        descriptionError: '描述不能为空'
      });
    } else {
      this.setState({
        descriptionError: ''
      });
    }
    this.props.updateBasicQuiz(basicQuiz);
  }

  updateOption({option, optionIndex}) {
    let basicQuiz = this.props.basicQuiz;
    basicQuiz.options[optionIndex] = option;
    this.props.updateBasicQuiz(basicQuiz);
  }

  updateAnswer({checked, optionIndex}) {
    let basicQuiz = this.props.basicQuiz;
    let answer = basicQuiz.answer;
    if (answer === '') {
      answer = [];
    } else {
      answer = answer.split(',');
    }
    if (checked) {
      answer.push(optionIndex);
    } else {
      answer = answer.filter((item) => {
        return item !== optionIndex;
      });
    }
    basicQuiz.answer = answer.toString();
    this.props.updateBasicQuiz(basicQuiz);
  }

  render() {
    let options = this.props.basicQuiz.options || [];
    let answer = this.props.basicQuiz.answer || '';
    if (answer === '') {
      answer = [];
    } else {
      answer = answer.split(',');
    }

    return (
      <div>
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
            <label className='col-sm-2 control-label'>选项</label>
            {
              options.map((option, index) => {
                let checked = answer.indexOf(index + '') === -1 ? '' : 'checked';
                return (
                  <MultipleChoiceOption option={option}
                                        checked={checked}
                                        key={index}
                                        optionIndex={index}
                                        basicQuiz={this.props.basicQuiz}
                                        updateOption={this.updateOption.bind(this)}
                                        updateAnswer={this.updateAnswer.bind(this)}/>);
              })
            }
          </div>
        </form>
      </div>
    );
  }
}
