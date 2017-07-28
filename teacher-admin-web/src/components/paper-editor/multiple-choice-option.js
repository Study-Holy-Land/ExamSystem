import {Component} from 'react';
import ErrorTip from './error-tip';

export default class MultipleChoiceOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionError: ''
    };
  }

  componentDidMount() {
    this.option.value = this.props.option || '';
    this.answer.checked = this.props.checked || '';
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

  handleClick(event) {
    const checked = event.target.checked;
    this.props.updateAnswer({optionIndex: event.target.value, checked});
  }

  render() {
    return (
      <div className='col-sm-9 form-inline col-sm-offset-2 checkbox'>
        <input type='checkbox' className='option-position'
               value={this.props.optionIndex + ''}
               ref={(ref) => {
                 this.answer = ref;
               }}
               onClick={this.handleClick.bind(this)}/>
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
