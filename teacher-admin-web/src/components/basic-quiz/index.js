import {Component} from 'react';
import '../../style/basic-quiz.less';
import BasicQuizList from '../../containers/basic-quiz/basic-quiz-list';
import BasicQuizEditor from './basic-quiz-editor';

export default class BasicQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: 0,
      index: -1,
      errors: []
    };
  }

  componentDidMount() {
    this.props.initBasicQuiz([]);
  }

  updateCurrentState({currentState, index}) {
    this.setState({
      currentState,
      index
    });
  }

  updateErrors(errors) {
    this.setState({
      errors
    });
  }

  render() {
    return (
      <div className='basic-quiz'>
        <div className='basic-quiz-header'>
          简单客观题管理
        </div>

        <div className='basic-quiz-body row'>
          <div className='col-sm-8'>
            <BasicQuizList currentState={this.state.currentState} errors={this.state.errors}
                           updateCurrentState={this.updateCurrentState.bind(this)}/>
          </div>

          <div className='col-sm-4 row'>
            <BasicQuizEditor currentState={this.state.currentState}
                             index={this.state.index}
                             updateCurrentState={this.updateCurrentState.bind(this)}
                             updateErrors={this.updateErrors.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}
