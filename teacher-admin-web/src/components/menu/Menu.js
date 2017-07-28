import {Component} from 'react';
import {Link, browserHistory} from 'react-router';

export default class Menu extends Component {

  componentWillMount() {
    let {text, uri} = this.props;
    const homeTabSelected = this.props.homeTabSelected;
    if (text === '个人中心' && homeTabSelected) {
      browserHistory.push(URI_PREFIX + uri);
    }
  }

  render() {
    let {text, uri, selected, icon = 'leaf'} = this.props;
    const homeTabSelected = this.props.homeTabSelected;
    let linkClass;
    if (text === '个人中心' && homeTabSelected) {
      linkClass = 'menu active';
    } else {
      linkClass = selected ? 'menu active' : 'menu';
    }
    return (
      <li>
        <Link to={URI_PREFIX + uri} className={linkClass}>
          <i className={'menu-icon fa fa-' + icon}></i>{text}
        </Link>
      </li>
    );
  }
}
