import {Component} from 'react';
import {NavDropdown, MenuItem} from 'react-bootstrap';
import user from '../../images/user.jpg';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
require('../../images/Logo_white.png');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
  }

  exitUser() {
    this.props.exit();
  }

  componentDidMount() {
    superagent
      .get(API_PREFIX + '/username')
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.setState({username: res.body.username});
        }
      });
  }

  componentDidUpdate() {
    if (this.props.logout) {
      this.props.resetLogout();
      this.props.router.push(URI_PREFIX + '/login');
    }
  }

  onClick() {
    this.props.router.push(URI_PREFIX + '/messageCenter');
  }

  render() {
    return (
      <div>
        <div className='header' id='header'>
            <img className='logo-img' src='build/Logo_white.png'/>
          <div className='nav-user-info pull-right'>
            <a onClick={this.onClick.bind(this)}><font color='white'><i className='fa fa-bell'> </i></font></a>
            <img className='nav-user-photo nav-inline' src={user} alt='用户头像'/>
            <NavDropdown eventKey={1} title={this.state.username} id='basic-nav-dropdown'
                         className='menu-drop no-padding nav-inline'>
              <MenuItem eventKey={1.1}>
                <button className='btn btn-default' onClick={this.exitUser.bind(this)}>
                  <i className='fa fa-power-off nav-inline'> </i>
                  &nbsp; 退出
                </button>
              </MenuItem>
            </NavDropdown>
          </div>
        </div>
      </div>
    );
  }
}
