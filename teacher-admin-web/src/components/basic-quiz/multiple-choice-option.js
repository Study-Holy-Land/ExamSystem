import {Component} from 'react';
import ErrorTip from './error-tip';

export default class MultipleChoiceOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }

  setRefValue() {
    const options = this.props.basicQuiz.options;
    let answer = this.props.basicQuiz.answer;
    if (answer === '') {
      answer = [];
    } else {
      answer = answer.split(',');
    }
    this.option.value = options[this.props.optionIndex] || '';
    this.answer.checked = answer.indexOf(this.answer.value) === -1 ? '' : 'checked';
  }

  componentDidMount() {
    this.setRefValue();
  }

  componentDidUpdate() {
    this.setRefValue();
  }

  updateOption() {
    const option = this.option.value.trim();
    if (!option) {
      this.setState({
        error: '选项描述不能为空'
      });
    } else {
      this.setState({
        error: ''
      });
    }
    this.props.updateOption({option, optionIndex: this.props.optionIndex});
  }

  handleFocus() {
    this.setState({
      error: ''
    });
  }

  handleClick(event) {
    const checked = event.target.checked;
    this.props.updateAnswer({optionIndex: event.target.value, checked});
  }

  render() {
    return (
      <div className='col-sm-9 form-inline col-sm-offset-3'>
        <input type='checkbox'
               className='form-control'
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
               onBlur={this.updateOption.bind(this)}
               onFocus={this.handleFocus.bind(this)}/>
        <ErrorTip error={this.state.error}/>
      </div>
    );
  }
}
