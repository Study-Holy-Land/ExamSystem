import {Component} from 'react';
import '../../style/mentor.less';

export default class TableHeader extends Component {
  render() {
    return (
      <div id='studentList-header'>
        <div className='header'>
          <div className='table-header'>学生列表</div>
        </div>
      </div>
    );
  }
}
