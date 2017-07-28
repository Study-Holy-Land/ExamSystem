import {Component} from 'react';
import ErrorTip from './error-tip';

class SingleChoiceOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionError: ''
    };
  }

  setRefValue() {
    this.option.value = this.props.option || '';
    this.answer.checked = this.props.checked;
  }

  componentDidMount() {
    this.setRefValue();
  }

  componentDidUpdate() {
    this.setRefValue();
  }

  updateOption() {
    const option = this.option.value.trim();
    const isDuplicated = this.props.basicQuiz.options.some((item, index) => item === option && index !== this.props.optionIndex);
    const errorArray = [
      {isError: !option, optionError: '选项不能为空'},
      {isError: (isDuplicated && option !== ''), optionError: '选项不能重复'}];
    errorArray.forEach(item => {
      if (item.isError) {
        this.setState({optionError: item.optionError});
      }
    });

    const noError = errorArray.every(item => !item.isError);
    if (noError) {
      this.setState({optionError: ''});
      this.props.updateOption({option, optionIndex: this.props.optionIndex});
    }
  }

  handleOnClick(e) {
    const checked = e.target.checked;
    this.props.updateAnswer({optionIndex: this.props.optionIndex, checked});
  }

  render() {
    return (
      <div className='col-sm-9 col-sm-offset-2 form-inline radio'>

        <input type='radio' name='optionsRadios' className='option-position'
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
               onBlur={this.updateOption.bind(this)}/>

        <ErrorTip error={this.state.optionError}/>
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
  }

  componentDidMount() {
    this.setRefValue();
  }

  componentDidUpdate() {
    this.setRefValue();
  }

  setRefValue() {
    this.description.value = this.props.basicQuiz.description || '';
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

  updateOption({option, optionIndex}) {
    let basicQuiz = this.props.basicQuiz;
    basicQuiz.options[optionIndex] = option;
    this.props.updateBasicQuiz(basicQuiz);
  }

  updateAnswer({optionIndex, checked}) {
    const answer = optionIndex + '';
    let basicQuiz = this.props.basicQuiz;
    if (checked) {
      basicQuiz.answer = answer;
      this.props.updateBasicQuiz(basicQuiz);
    }
  }

  render() {
    const options = this.props.basicQuiz.options || [];
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
                const answer = this.props.basicQuiz.answer || '';
                const checked = index === parseInt(answer) ? 'checked' : '';
                return <SingleChoiceOption option={option}
                                           basicQuiz={this.props.basicQuiz}
                                           key={index}
                                           optionIndex={index}
                                           updateAnswer={this.updateAnswer.bind(this)}
                                           updateOption={this.updateOption.bind(this)}
                                           checked={checked}/>;
              })
            }
          </div>
        </form>
      </div>
    );
  }
}
