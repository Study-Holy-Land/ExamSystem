import {Component} from 'react';
import CreatedHomework from './CreatedHomework';

export default class HomeworkEditor extends Component {
  render() {
    return (
      <div>
        <CreatedHomework {...this.props}/>
      </div>
    );
  }
}
