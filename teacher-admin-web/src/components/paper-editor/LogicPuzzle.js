import {Component} from 'react';
import '../../style/paper-edit.less';

const DifficultySetter = ({text, difficulty, content, disabled}) => (
  <div className='form-inline'>
    <div className='col-sm-2 no-padding input-style form-group'>
      <label >{text}</label>
      <input disabled={disabled} type='number' className='level-input form-control' ref={(ref) => {
        content[difficulty] = ref;
      }} onBlur={content.handleUpdate.bind(content)}/>
    </div>
  </div>
);

const labels = [
  {
    text: '简单',
    difficulty: 'easy'
  },
  {
    text: '一般',
    difficulty: 'normal'
  },
  {
    text: '困难',
    difficulty: 'hard'
  }
];

export default class LogicPuzzle extends Component {
  handleUpdate() {
    let quizzes;
    if (this.inputInfo.checked) {
      quizzes = {
        easy: Number(this.easy.value) || 0,
        normal: Number(this.normal.value) || 0,
        hard: Number(this.hard.value) || 0
      };
    }
    this.props.updateLogicPuzzle({quizzes});
    this.props.editPaper({hasUnsavedChanges: true});
  }

  componentDidUpdate() {
    this.inputInfo.checked = this.props.toggleStatus;
    this.easy.value = this.props.quizzes.easy || '';
    this.normal.value = this.props.quizzes.normal || '';
    this.hard.value = this.props.quizzes.hard || '';
  }

  render() {
    return (
      <div id='paper-checkbox'>
        <div className='row form-group'>
          <label className='bigger col-sm-3 text-right'>
            逻辑题
          </label>
          <div className='col-sm-6'>
            <input type='checkbox' className='col-sm-3 input-info'
                   ref={(ref) => {
                     this.inputInfo = ref;
                   }}
                   disabled={this.props.disabled || this.props.isDistributed}
                   onChange={this.handleUpdate.bind(this)}/>

            {this.props.disabled ? <span className='col-sm-6'>练习模式下,逻辑题不可用</span> : ''}
          </div>
        </div>
        <div ref={(ref) => {
          this.logicBox = ref;
        }}>
          <div className='row form-group col-sm-offset-3'>
            {labels.map((label, index) => (
              <DifficultySetter key={index} {...label} content={this}
                                disabled={!this.props.toggleStatus || this.props.isDistributed}/>)) }
          </div>
        </div>
      </div>
    );
  }
}
