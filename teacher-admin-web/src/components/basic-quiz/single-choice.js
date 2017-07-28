import {Component} from 'react';
import ErrorTip from './error-tip';

class SingleChoiceOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionErr: ''
    };
  };

  componentDidUpdate() {
    this.setRefValue();
  }

  componentDidMount() {
    this.setRefValue();
  }

  setRefValue() {
    const options = this.props.basicQuiz.options;
    this.option.value = options[this.props.optionIndex] || '';
    this.answer.checked = this.props.checked;
  }

  handleOnClick(e) {
    const checked = e.target.checked;
    this.props.updateAnswer({optionIndex: this.props.optionIndex, checked});
  }

  handleFocus() {
    this.setState({
      optionErr: ''
    });
  }

  handleOnBlur() {
    if (!this.option.value) {
      this.setState({
        optionErr: '题目描述不能为空'
      });
    } else {
      this.setState({
        optionErr: ''
      });
    }
    this.props.updateOption({option: this.option.value, optionIndex: this.props.optionIndex});
  }

  render() {
    return (
      <div className='col-sm-9 col-sm-offset-3 form-inline'>
        <input type='radio' name='option'
               ref={(ref) => {
                 this.answer = ref;
               }}
               onClick={this.handleOnClick.bind(this)}/>
        <input type='text'
               className='form-control'
               placeholder='选项描述'
               ref={(ref) => {
                 this.option = ref;
               }}
               onBlur={this.handleOnBlur.bind(this)}
               onFocus={this.handleFocus.bind(this)}/>
        <ErrorTip error={this.state.optionErr}/>
      </div>
    );
  }
}

export default class SingleChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionError: ''
    };
  };

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

  handleFocus() {
    this.setState({
      descriptionError: ''
    });
  }

  updateDescription(index) {
    const description = this.description.value;
    let basicQuiz = this.props.basicQuiz[this.props.index];
    if (!this.description.value.trim()) {
      this.setState({
        descriptionError: '题目描述不能为空'
      });
    } else {
      this.setState({
        descriptionError: ''
      });
    }
    basicQuiz.description = description;
    this.props.updateQuiz({index, quiz: basicQuiz});
  }

  updateOption({option, optionIndex}) {
    const index = this.props.index;
    let basicQuiz = this.props.basicQuiz[index];
    basicQuiz.options[optionIndex] = option;
    this.props.updateQuiz({index, quiz: basicQuiz});
  }

  updateAnswer({optionIndex, checked}) {
    const answer = optionIndex.toString();
    const index = this.props.index;
    let basicQuiz = this.props.basicQuiz[index];
    if (checked) {
      basicQuiz.answer = answer;
      this.props.updateQuiz({index, quiz: basicQuiz});
    }
  }

  render() {
    const options = this.props.basicQuiz[this.props.index].options;
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
                        onFocus={this.handleFocus.bind(this)}/>
              <ErrorTip error={this.state.descriptionError}/>
            </div>
          </div>

          <div className='form-group'>
            <label className='col-sm-3 control-label'>选项</label>
            {
              options.map((option, index) => {
                const checked = index === parseInt(this.props.basicQuiz[this.props.index].answer) ? 'checked' : '';
                return <SingleChoiceOption key={index}
                                           updateOption={this.updateOption.bind(this)}
                                           updateAnswer={this.updateAnswer.bind(this)}
                                           basicQuiz={this.props.basicQuiz[this.props.index]}
                                           optionIndex={index} checked={checked}/>;
              })
            }
          </div>
        </form>
      </div>
    );
  }
}
