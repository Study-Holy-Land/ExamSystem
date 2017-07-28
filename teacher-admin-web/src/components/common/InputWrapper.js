import {Component} from 'react';

export default class InputWrapper extends Component {
  render() {
    let ifShowWarning = !!this.props.warning;

    return (
      <div>
        <div>
          {this.props.children}
        </div>

        <div className={'row warning' + (ifShowWarning ? '' : ' warning-hidden')}>
          <div className='col-xs-12'>
            <i className='fa fa-warning warning-icon'> </i>
            <span>{this.props.warning}</span>
          </div>
        </div>
      </div>
    );
  }
}
