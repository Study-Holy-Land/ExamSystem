import {Component} from 'react';

export default class ErrorTip extends Component {
  render() {
    return (
      <span className='error-tip'>
        <i className={'error-icon ' + (this.props.error ? 'fa fa-times-circle' : '')}></i>
        {this.props.error}
      </span>
    );
  }
}
