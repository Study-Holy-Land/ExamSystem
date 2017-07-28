import {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: this.props.currentPage
    };
  };

  changePage() {
    this.props.onPageChange(this.state.currentPage);
  }

  goPage(page) {
    if (page === '...') {
      return;
    }
    this.setState({
      currentPage: page
    }, this.changePage);
  }

  goPrevious() {
    if (this.state.currentPage === 1) {
      return;
    }
    this.setState({
      currentPage: this.state.currentPage - 1
    }, this.changePage);
  }

  goNext() {
    if (this.state.currentPage === this.props.totalPage) {
      return;
    }
    this.setState({
      currentPage: this.state.currentPage + 1
    }, this.changePage);
  }

  caculatePageArray(start, end, pageArray) {
    for (let i = start; i <= end; ++i) {
      pageArray.push({page: i});
    }
  }

  cacluatePagination(totalPage, currentPage, pageArray) {
    this.caculatePageArray(1, 3, pageArray);
    if (currentPage > 2 && currentPage < 6) {
      this.caculatePageArray(4, currentPage + 1, pageArray);
    } else {
      pageArray.push({page: '...'});
      this.caculatePageArray(currentPage - 1, currentPage + 1, pageArray);
    }
    if (totalPage - currentPage === 2 || totalPage - currentPage === 3 || totalPage - currentPage === 4) {
      this.caculatePageArray(currentPage + 2, totalPage, pageArray);
    } else {
      pageArray.push({page: '...'});
      this.caculatePageArray(totalPage - 2, totalPage, pageArray);
    }
  }

  getPagination(totalPage, currentPage, pageArray) {
    if (currentPage <= 2 || totalPage - currentPage <= 1) {
      this.caculatePageArray(1, 3, pageArray);
      pageArray.push({page: '...'});
      this.caculatePageArray(totalPage - 2, totalPage, pageArray);
    } else {
      this.cacluatePagination(totalPage, currentPage, pageArray);
    }
  }

  render() {
    const totalPage = this.props.totalPage;
    let currentPage = this.state.currentPage;

    const pageArray = [];

    if (totalPage < 7 && totalPage > 0) {
      this.caculatePageArray(1, totalPage, pageArray);
    } else {
      this.getPagination(totalPage, currentPage, pageArray);
    }

    let pageIndex = pageArray.map((page, index) => {
      return (
        <li key={index} className={page.page === this.props.currentPage ? 'active' : ''}>
          <a name={page.page} onClick={this.goPage.bind(this, page.page)}> {page.page}</a>
        </li>
      );
    });

    const previousClass = currentPage === 1 ? 'disabled' : '';
    const nextClass = currentPage === this.props.totalPage ? 'disabled' : '';
    return (<div>
      <ul className='pagination'>
        <li className={previousClass}>
          <a onClick={this.goPrevious.bind(this)}>
            <i className='fa fa-chevron-left'></i>
          </a>
        </li>
        {pageIndex}
        <li className={nextClass}>
          <a onClick={this.goNext.bind(this)}>
            <i className='fa fa-chevron-right'></i>
          </a>
        </li>
      </ul>
    </div>);
  }
}
const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(withRouter(Pagination));

