import {Component} from 'react';
import ErrorTip from './error-tip';

export default class MultipleChoiceShow extends Component {
  updateState() {
    this.props.updateCurrentState({currentState: 1, index: this.props.index});
  }

  deleteBlankQuiz() {
    this.props.updateCurrentState({currentState: 0, index: -1});
    this.props.deleteBlankQuiz(this.props.index);
  }

  render() {
    return (
      <div className='blank-quiz-show'>
        <div className='quiz-icon'>
          <i className='fa fa-trash-o pull-right' onClick={this.deleteBlankQuiz.bind(this)}></i>
        </div>
        <div onClick={this.updateState.bind(this)}>
          <div className='description'>
            {this.props.description}
          </div>

          <div className='form-group'>
            {
              this.props.options.map((option, index) => {
                return (
                  <div key={index} className='answer-radio'>
                    <input type='checkbox' disabled='disabled'/>
                    <label>{option}</label>
                  </div>
                );
              })
            }
          </div>
        </div>
        <ErrorTip error={this.props.error}/>
      </div>
    );
  }
}
