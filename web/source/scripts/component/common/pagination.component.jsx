var Pagination = React.createClass({
  getInitialState() {
    return {
      currentPage: this.props.currentPage
    };
  },

  changePage: function () {
    this.props.onPageChange(this.state.currentPage);
  },

  goPage: function (page) {
    if (page === '...') {
      return;
    }
    this.setState({
      currentPage: page
    }, this.changePage);
  },

  goPrevious: function () {
    if (this.state.currentPage === 1) {
      return;
    }
    this.setState({
      currentPage: this.state.currentPage - 1
    }, this.changePage);
  },

  goNext: function () {
    if (this.state.currentPage === this.props.totalPage) {
      return;
    }
    this.setState({
      currentPage: this.state.currentPage + 1
    }, this.changePage);
  },

  caculatePageArray: function (start, end, pageArray) {
    for (let i = start; i <= end; ++i) {
      pageArray.push({page: i});
    }
  },

  cacluatePagination: function (totalPage, currentPage, pageArray) {
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
  },

  getPagination: function (totalPage, currentPage, pageArray) {
    if (currentPage <= 2 || totalPage - currentPage <= 1) {
      this.caculatePageArray(1, 3, pageArray);
      pageArray.push({page: '...'});
      this.caculatePageArray(totalPage - 2, totalPage, pageArray);
    } else {
      this.cacluatePagination(totalPage, currentPage, pageArray);
    }
  },

  render: function () {

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
        <li key={index} className={page.page === this.state.currentPage ? 'active' : ''}>
          <a name={page.page} onClick={this.goPage.bind(this, page.page)}> {page.page}</a>
        </li>
      );
    });

    const previousClass = currentPage === 1 ? 'disabled' : '';
    const nextClass = currentPage === this.props.totalPage ? 'disabled' : '';
    let hidden = this.props.totalPage !==0 ? 'show-pagination' : 'hidden';

    return (<div className={hidden}>
      <ul className='pagination'>
        <li className={previousClass}>
          <a onClick={this.goPrevious}>
            <i className='fa fa-chevron-left'></i>
          </a>
        </li>
        {pageIndex}
        <li className={nextClass}>
          <a onClick={this.goNext}>
            <i className='fa fa-chevron-right'></i>
          </a>
        </li>
      </ul>
    </div>);
  }
});

module.exports = Pagination;
