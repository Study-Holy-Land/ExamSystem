import {Component} from 'react';

export default class BasicQuizEditorHeader extends Component {
  handleClick(index) {
    if (index === 1) {
      return;
    }
    this.props.updateCurrentState({currentState: index, index: -1});
  }

  render() {
    const currentOperation = this.props.currentState;
    const operation = ['新建', '修改'];
    return (
      <div className='btn-group btn-group-justified tab-padding'>
        {operation.map((item, index) => {
          return <div className='btn-group' key={index} role='group'>
            <button type='button'
                    className={currentOperation === index ? 'btn btn-primary' : 'btn btn-default'}
                    disabled={index === 1 ? 'disabled' : ''}
                    onClick={this.handleClick.bind(this, index)}>{item}</button>
          </div>;
        })}
      </div>
    );
  }
}
