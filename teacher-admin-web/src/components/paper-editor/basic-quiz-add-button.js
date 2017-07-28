import {Component} from 'react';

export default class BasicQuizAddButton extends Component {
  handleClick() {
    this.props.updateState(this.props.sectionIndex);
  }

  render() {
    return (
      <div className='add-section'>
        <i className='fa fa-plus fa-small' onClick={this.props.isDistributed ? '' : this.handleClick.bind(this)}></i>
      </div>
    );
  }
}
