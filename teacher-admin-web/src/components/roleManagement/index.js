import {Component} from 'react';
import '../../style/role-management.less';
import RoleManagementHeader from './role-management-header';
import RoleManagementBody from './role-management-body';

export default class RoleManagement extends Component {
  render() {
    return (<div id='role-management'>
      <RoleManagementHeader/>
      <RoleManagementBody/>
    </div>);
  }
}
