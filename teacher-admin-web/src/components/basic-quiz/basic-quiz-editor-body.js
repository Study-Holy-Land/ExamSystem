import {Component} from 'react';
import BasicBlankQuiz from '../../containers/basic-quiz/basic-blank-quiz';
import SingleChoice from '../../containers/basic-quiz/single-choice.js';
import MultipleChoice from '../../containers/basic-quiz/multiple-choice';

const basicType = {
  'BASIC_BLANK_QUIZ': BasicBlankQuiz,
  'SINGLE_CHOICE': SingleChoice,
  'MULTIPLE_CHOICE': MultipleChoice
};

export default class BasicQuizEditorBody extends Component {
  addBlankQuiz() {
    const blankQuiz = {
      description: '',
      answer: '',
      type: 'BASIC_BLANK_QUIZ'
    };
    this.props.updateCurrentState({currentState: 0, index: this.props.index});
    this.props.addQuiz(blankQuiz);
  }

  addSingleChoice() {
    const singleChoice = {
      description: '',
      options: ['', '', '', ''],
      answer: '',
      type: 'SINGLE_CHOICE'
    };
    this.props.updateCurrentState({currentState: 0, index: this.props.index});
    this.props.addQuiz(singleChoice);
  }

  addMultipleChoice() {
    const multipleChoice = {
      description: '',
      options: ['', '', '', ''],
      answer: '',
      type: 'MULTIPLE_CHOICE'
    };
    this.props.updateCurrentState({currentState: 0, index: this.props.index});
    this.props.addQuiz(multipleChoice);
  }

  render() {
    let Quiz = '';
    if (this.props.isShow === 1) {
      Quiz = basicType[this.props.basicQuiz[this.props.index].type];
    }

    return (
      <div className='editor-body'>
        <div className={this.props.isShow === 0 ? '' : 'hidden'}>
          <div className='editor-font col-sm-4' onClick={this.addBlankQuiz.bind(this)}>填空题</div>
          <div className='editor-font col-sm-4' onClick={this.addSingleChoice.bind(this)}>单选题</div>
          <div className='editor-font col-sm-4' onClick={this.addMultipleChoice.bind(this)}>多选题</div>
        </div>

        <div className={this.props.isShow === 1 ? '' : 'hidden'}>
          {this.props.index === -1 ? '' : <Quiz index={this.props.index}/>}
        </div>
      </div>
    );
  }
}
