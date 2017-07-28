import {Component} from 'react';
import ProgramHeader from './program-header';
import ProgramBody from './program-body';
import '../../style/program.less';

export default class Program extends Component {
  render() {
    return (<div className='program'>
      <ProgramHeader/>
      <ProgramBody/>
    </div>);
  }
}
