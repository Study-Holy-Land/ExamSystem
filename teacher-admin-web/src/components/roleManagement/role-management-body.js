import {Component} from 'react';
import '../../style/role-management.less';
import RoleManagementEditor from './role-management-editor';
import superagent from 'superagent';
import errorHandler from '../../tool/errorHandler';
import noCache from 'superagent-no-cache';
import RoleManagementList from './role-management-list';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

const rolesConfiguration = [
  {text: 'All', value: -1},
  {text: 'PracticeMaker', value: 1},
  {text: 'PaperMaker', value: 2},
  {text: 'ProgramManager', value: 3},
  {text: 'Mentor', value: 4},
  {text: 'Learner', value: 0},
  {text: 'ADMIN', value: 9}
];

class AuthorityBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      currentUser: {
        userName: '',
        email: '',
        mobilePhone: '',
        password: '',
        role: []
      },
      currentRole: '',
      pageCount: 15,
      totalPage: '',
      roleStatisticsCount: []
    };
  }

  requestData(currentRole) {
    const page = parseInt(this.props.uri.query.page) || 1;
    let queryData = {
      page,
      pageCount: this.state.pageCount
    };
    if (currentRole !== -1) {
      queryData.role = currentRole;
    }
    superagent.get(API_PREFIX + '/users')
      .use(noCache)
      .use(errorHandler)
      .query(queryData)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        const roleStatisticsCount = {
          totalCount: res.body.totalCount,
          roleCount: res.body.roleCount
        };
        this.setState({
          userList: res.body.data,
          totalPage: res.body.totalPage,
          roleStatisticsCount
        });
      });
  }

  componentDidMount() {
    const role = rolesConfiguration.find(role => role.text === this.props.uri.query.role);
    if (role) {
      this.requestData(role.value);
      this.changeActiveStatus(rolesConfiguration.indexOf(role));
    } else {
      this.requestData(-1);
      this.changeActiveStatus(0);
    }
  }

  changeActiveStatus(activeStatus) {
    this.setState({
      activeStatus
    });
  }

  changeState(user) {
    this.setState({
      currentUser: user
    });
  }

  updateUserInfo() {
    const uriSearch = this.props.uri.search || '?role=All&page=1';
    const role = rolesConfiguration.find(item => uriSearch.indexOf(item.text) > -1);
    this.requestData(role.value);
    this.setState({
      currentUser: {
        role: []
      }
    });
  }

  addUser() {
    const uriSearch = this.props.uri.search || '?role=All&page=1';
    const role = rolesConfiguration.find(item => uriSearch.indexOf(item.text) > -1);
    this.requestData(role.value);
    this.setState({
      currentUser: {
        role: []
      }
    });
  }

  changeTotalPage(currentRole) {
    this.setState({currentRole});
    this.requestData(currentRole);
  }

  getUserList(list) {
    this.setState({
      userList: list
    });
  }

  render() {
    return (<div className='authority-body row'>
        <div className='col-sm-8'>
          <RoleManagementList userList={this.state.userList}
                              changeState={this.changeState.bind(this)}
                              totalPage={this.state.totalPage}
                              pageCount={this.state.pageCount}
                              changeActiveStatus={this.changeActiveStatus.bind(this)}
                              activeStatus={this.state.activeStatus}
                              rolesConfiguration={rolesConfiguration}
                              changeTotalPage={this.changeTotalPage.bind(this)}
                              getUserList={this.getUserList.bind(this)}
                              {...this.state.roleStatisticsCount}/>
        </div>
        <div className='col-sm-4'>
          <RoleManagementEditor {...this.state.currentUser}
                                currentRole={this.state.currentRole}
                                userList={this.state.userList}
                                updateUserInfo={this.updateUserInfo.bind(this)}
                                addUser={this.addUser.bind(this)}/>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => state;

export default

connect(mapStateToProps)(withRouter(AuthorityBody));
