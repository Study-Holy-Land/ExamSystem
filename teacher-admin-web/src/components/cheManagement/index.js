import {Component} from 'react';
import CheManagementHeader from './che-management-header';
import CheManagementBody from './che-management-body';
import '../../style/che-management.less';
// import '../../style/react-bootstrap-switch.min.css';
// import '../../style/react-bootstrap-switch.css';

export default class CheManagement extends Component {
  render() {
    return (
      <div id='che-management'>
        <CheManagementHeader/>
        <CheManagementBody/>
      </div>
    );
  }

}
