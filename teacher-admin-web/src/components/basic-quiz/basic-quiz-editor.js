import {Component} from 'react';
import BasicQuizEditorHeader from './basic-quiz-editor-header';
import BasicQuizEditorBody from '../../containers/basic-quiz/basic-quiz-editor-body';
import BasicQuizEditorFoot from '../../containers/basic-quiz/basic-quiz-editor-foot';

export default class BasicQuizEditor extends Component {

  render() {
    return (
      <div className='quiz-editor'>
        <BasicQuizEditorHeader currentState={this.props.currentState}
                               updateCurrentState={this.props.updateCurrentState}/>
        <BasicQuizEditorBody isShow={this.props.currentState}
                             index={this.props.index}
                             updateCurrentState={this.props.updateCurrentState}/>
        <BasicQuizEditorFoot updateErrors={this.props.updateErrors}/>
      </div>
    );
  }
}
