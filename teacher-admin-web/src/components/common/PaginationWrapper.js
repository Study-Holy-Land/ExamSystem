import {Component} from 'react';
import {Pagination} from '../common';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

class PaginationWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeStatus: this.props.activeStatus,
      currentPage: this.props.currentPage,
      uriSearch: ''
    };
  }

  componentWillMount() {
    this.setState({
      currentPage: parseInt(this.props.uri.query.page) || 1
    });
  }

  componentWillReceiveProps(next) {
    let activeStatus = this.state.activeStatus;
    let currentPage = this.state.currentPage;
    if (next.activeStatus !== this.state.activeStatus) {
      activeStatus = next.activeStatus;
      currentPage = 1;
    }

    this.setState({
      activeStatus,
      currentPage,
      uriSearch: this.props.uri.search
    });
  }

  changePage() {
    this.props.onPageChange(this.state.currentPage);
    const pathname = this.props.uri.pathname;
    const uriSearch = this.props.uri.search || window.location.search;
    if (uriSearch.indexOf('&page=') > -1 || uriSearch.indexOf('?page=') > -1) {
      const rexp = `page=${this.props.uri.query.page}`;
      const newUriSearch = uriSearch.replace(rexp, `page=${this.state.currentPage}`);
      this.props.router.push(pathname + newUriSearch);
    } else {
      if (uriSearch === '') {
        this.props.router.push(pathname + '?page=' + this.state.currentPage);
      } else {
        this.props.router.push(pathname + uriSearch + '&page=' + this.state.currentPage);
      }
    }
  }

  handlePage(page) {
    this.setState({
      currentPage: page
    }, this.changePage);
  }

  render() {
    let hidden = this.props.totalPage ? '' : 'hidden';
    return (
      <div className={hidden}>
        <Pagination totalPage={this.props.totalPage}
                    currentPage={this.state.currentPage}
                    onPageChange={this.handlePage.bind(this)}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(withRouter(PaginationWrapper));
