import {Component} from 'react';
import '../../style/demo.less';
import Header from '../../containers/menu/header';
import LeftNav from '../../containers/menu/left-nav';
import BreadCrumb from '../../containers/menu/breadcrumb';

export default class Layout extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'UPDATE_URI',
      uri: this.props.location
    });

    this.props.router.listen(location => {
      this.props.dispatch({
        type: 'UPDATE_URI',
        uri: location
      });
    });
  }

  render() {
    return (
      <div id='demo'>
        <div>
          <Header />
        </div>
        <div className='col-sm-2 no-padding'>
          <LeftNav />
        </div>
        <div className='col-sm-10 no-padding'>
          <BreadCrumb/>
          {this.props.children}
        </div>
      </div>
    );
  }
}
