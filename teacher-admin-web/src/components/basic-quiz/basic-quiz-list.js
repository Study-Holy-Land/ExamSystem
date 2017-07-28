import {Component} from 'react';
import SingleChoiceShow from '../../containers/basic-quiz/single-choice-show';
import BasicBlankQuizShow from '../../containers/basic-quiz/blank-quiz-show';
import MultipleChoiceShow from '../../containers/basic-quiz/multiple-choice-show';

const basicType = {
  'BASIC_BLANK_QUIZ': BasicBlankQuizShow,
  'SINGLE_CHOICE': SingleChoiceShow,
  'MULTIPLE_CHOICE': MultipleChoiceShow
};

export default class BasicQuizList extends Component {

  render() {
    const basicQuiz = this.props.basicQuiz || [];
    return (
      <div className='row blank-quiz'>
        {
          basicQuiz.map((quiz, index) => {
            let Quiz = basicType[quiz.type];
            let error = this.props.errors.indexOf(index + 1) === -1 ? '' : '该题未填写完整';
            return (
              <Quiz updateCurrentState={this.props.updateCurrentState}
                    {...quiz} error={error}
                    index={index} key={index}/>
            );
          })
        }
      </div>
    );
  }
}
