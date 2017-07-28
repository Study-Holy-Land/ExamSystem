import {Component} from 'react';
import ErrorTip from './error-tip';

export default class BasicBlankQuizShow extends Component {
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
          <div className='form-group answer'>
            <input type='text' className='form-control' disabled='disabled'/>
          </div>
        </div>
        <ErrorTip error={this.props.error}/>
      </div>
    );
  }
}
