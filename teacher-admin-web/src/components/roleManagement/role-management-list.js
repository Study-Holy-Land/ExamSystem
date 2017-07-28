import {Component} from 'react';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import errorHandler from '../../tool/errorHandler';
import '../../style/role-management.less';
import {PaginationWrapper} from '../common';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

class RoleManagementList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      activeUserId: -1,
      currentRole: -1,
      currentPage: 1,
      currentUser: {},
      count: 1
    };
  }

  clickUser(user) {
    this.setState({
      currentUser: user,
      activeUserId: user.id
    });
    this.props.changeState(user);
  }

  // 解决点击浏览器后退键的问题，分页无法变换
  // getQueryData(urlData, rolesConfiguration) {
  //   let queryData;
  //   let currentRole;
  //   if (urlData.indexOf('?') > 0) {
  //     const queryString = urlData.split('?')[1];
  //     let queryObj = {};
  //     if (queryString.indexOf('&') > 0) {
  //       const queryArray = queryString.split('&');
  //       queryObj = {
  //         role: queryArray[0].split('=')[1],
  //         page: queryArray[1].split('=')[1]
  //       };
  //     } else {
  //       queryObj.role = queryString.split('=')[1];
  //     }
  //     currentRole = rolesConfiguration.find(roleCfig => queryObj.role === roleCfig.text);
  //     queryData = {
  //       page: queryObj.page || 1,
  //       pageCount: this.props.pageCount
  //     };
  //     if (currentRole.value !== -1) {
  //       queryData.role = currentRole.value;
  //     }
  //   } else {
  //     queryData = {
  //       page: 1,
  //       pageCount: this.props.pageCount
  //     };
  //   }
  //   return queryData;
  // }
  //
  // componentDidUpdate() {
  //   const urlString = window.location.href;
  //   const queryData = this.getQueryData(urlString, this.props.rolesConfiguration);
  //   this.handlePageChange(queryData.page);
  // }

  componentDidMount() {
    const isExistUser = this.props.userList.find((user) => user.id === this.state.activeUserId);
    if (!isExistUser) {
      this.setState({activeUserId: -1});
    }
  }

  handlePageChange(page) {
    let queryData = {
      page,
      pageCount: this.props.pageCount
    };
    if (this.state.currentRole !== -1) {
      queryData.role = this.state.currentRole;
    }
    const pathname = this.props.uri.pathname;
    const index = this.props.activeStatus;
    const currentPath = this.props.rolesConfiguration[index].text;
    if (this.props.uri.search === '') {
      this.props.router.push(`${pathname}?role=${currentPath}`);
    }
    superagent.get(API_PREFIX + '/users')
      .use(noCache)
      .use(errorHandler)
      .query(queryData)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.props.getUserList(res.body.data);
        }
      });
  }

  getRoleLabels() {
    return this.props.rolesConfiguration.map((roleCfg, index) => {
      const active = this.props.activeStatus === index ? 'label-primary' : 'label-default';
      let count = 0;
      if (roleCfg.value < 0) {
        count = this.props.totalCount;
      } else if (this.props.roleCount) {
        const roleCount = this.props.roleCount.find((item) => item.role === roleCfg.value);
        if (roleCount && roleCount.count) {
          count = roleCount.count;
        }
      }
      return <span className={'label ' + active} key={index}
                   onClick={this.getCurrentRoleList.bind(this, index)}>
        {roleCfg.text + `(${count})`}
        </span>;
    });
  }

  getCurrentRoleList(index) {
    const pathname = this.props.uri.pathname;
    const currentPath = this.props.rolesConfiguration[index].text;
    this.props.router.push(`${pathname}?role=${currentPath}&page=${this.state.currentPage}`);
    const currentRole = this.props.rolesConfiguration[index].value;
    this.setState({
      activeUserId: -1,
      currentRole,
      currentPage: 1
    }, () => {
      this.props.changeTotalPage(currentRole);
      this.props.changeActiveStatus(index);
    });
  }

  getCurrentRoleUserListText() {
    const userList = this.props.userList || [];
    return userList.map((user, index) => {
      let active = this.state.activeUserId === user.id ? 'info' : '';
      const rolesText = user.role.map((role) => {
        return this.props.rolesConfiguration.find((roleCfg) => roleCfg.value === role);
      });
      const roleHTML = rolesText.map((roleText, index) => {
        if (roleText !== undefined) {
          return index === 0 ? roleText.text : ',' + roleText.text;
        }
      });
      return <tbody key={index}>
      <tr onClick={this.clickUser.bind(this, user)} className={'user-role-tab ' + active}>
        <td>{user.userName}</td>
        <td>{user.email}</td>
        <td>{roleHTML}</td>
      </tr>
      </tbody>;
    });
  }

  render() {
    return <div className='role-management-list'>
      <h4 className='margin-border'>{this.getRoleLabels()}</h4>
      <table className='table table-bordered table-striped text-left'>
        <thead>
        <tr>
          <th>UserName</th>
          <th>Email</th>
          <th>Roles</th>
        </tr>
        </thead>
        {this.getCurrentRoleUserListText()}
      </table>

      <div className='form-footer row'>
        <div className=' dataTable-pagination'>
          <PaginationWrapper totalPage={this.props.totalPage}
                             currentPage={this.state.currentPage}
                             onPageChange={this.handlePageChange.bind(this)}
                             rolesConfiguration={this.props.rolesConfiguration}
                             activeStatus={this.props.activeStatus}/>
        </div>
      </div>
    </div>;
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(withRouter(RoleManagementList));
