import {Component} from 'react';
import StackHeader from './stack-header';
import StackBody from './stack-body';
import '../../style/stack.less';

export default class Stack extends Component {

  render() {
    return (
      <div className='stack'>
        <StackHeader/>
        <StackBody/>
      </div>
    );
  }
}
