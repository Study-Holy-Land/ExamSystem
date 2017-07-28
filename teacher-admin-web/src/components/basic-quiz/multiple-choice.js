import {Component} from 'react';
import ErrorTip from './error-tip';
import MultipleChoiceOption from './multiple-choice-option';

export default class MultipleChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionError: ''
    };
  }

  setRefValue() {
    if (this.props.index === -1) {
      this.description.value = '';
    } else {
      this.description.value = this.props.basicQuiz[this.props.index].description || '';
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

  updateOption({option, optionIndex}) {
    let basicQuiz = this.props.basicQuiz[this.props.index];
    basicQuiz.options[optionIndex] = option;
    this.props.updateQuiz({index: this.props.index, quiz: basicQuiz});
  }

  updateAnswer({checked, optionIndex}) {
    let basicQuiz = this.props.basicQuiz[this.props.index];
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
    this.props.updateQuiz({index: this.props.index, quiz: basicQuiz});
  }

  handleFocus() {
    this.setState({
      descriptionError: ''
    });
  }

  render() {
    let options = this.props.basicQuiz[this.props.index].options || [];
    let basicQuiz = this.props.basicQuiz[this.props.index];
    let answer = basicQuiz.answer;
    if (answer === '') {
      answer = [];
    } else {
      answer = answer.split(',');
    }

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
                        onBlur={this.updateDescription.bind(this)}
                        onFocus={this.handleFocus.bind(this)}/>
              <ErrorTip error={this.state.descriptionError}/>
            </div>
          </div>

          <div className='form-group'>
            <label className='col-sm-3 control-label'>选项</label>
            {
              options.map((option, index) => {
                return (
                  <MultipleChoiceOption key={index} optionIndex={index}
                                        basicQuiz={this.props.basicQuiz[this.props.index]}
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
