import {Component} from 'react';
import Menu from './Menu';
import superagent from 'superagent';
import errorHandler from '../../tool/errorHandler';
import noCache from 'superagent-no-cache';

export default class LeftNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featureToggle: {},
      navigator: [],
      homeTabSelected: false
    };
  }

  componentWillReceiveProps(next) {
    this.filterLeftNav(next.navigator, (navigator) => {
      this.setState({navigator});
    });
  }

  componentWillMount() {
    superagent.get(API_PREFIX + '/global-vars')
      .use(noCache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({
          featureToggle: res.body.featureToggle
        }, () => {
          this.filterLeftNav('', (navigator) => {
            this.setState({navigator});
          });
        });
      });
  }

  filterLeftNav(menu, callback) {
    const MenuData = menu || this.props.navigator;
    const currentSelectedTab = MenuData.find(menu => menu.selected === true);

    let userRoles;

    superagent.get(API_PREFIX + '/profile')
      .use(noCache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        userRoles = res.body.role;
        const isReserveCurrentRole = currentSelectedTab.role.some((item) => userRoles.includes(item));
        if (!isReserveCurrentRole) {
          this.setState({homeTabSelected: true});
        }
        const navData = MenuData.map((nav) => {
          const tabText = nav.uri.split('/')[1];
          if (this.state.featureToggle[tabText] === false) {
            return;
          } else {
            const whetherAuthority = nav.role.some((item) => userRoles.includes(item));
            if (whetherAuthority) {
              return nav;
            }
            return;
          }
        });
        const navigator = navData.filter((nav) => nav);
        callback(navigator);
      });
  }

  render() {
    return (
      <div className='left-nav' id='leftNav'>
        <div>
          <ul>
            {
              this.state.navigator.map((item, index) => {
                return (<Menu key={index} homeTabSelected={this.state.homeTabSelected}
                              {...item}
                />);
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}
