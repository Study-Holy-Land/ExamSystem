var Pagination = require('../common/pagination.component.jsx');
var request = require('superagent');
var noCache = require('superagent-no-cache');
var errorHandler = require('../../../../tools/error-handler.jsx');

var TableFooter = React.createClass({
  getInitialState() {
    return {
      currentPage: 1,
      pageCount: 15
    };
  },

  handlePageChange: function (page) {
    request
      .get(API_PREFIX+'students')
      .use(noCache)
      .use(errorHandler)
      .query({
        page,
        pageCount: this.state.pageCount
      })
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.props.onGetStudentsList(res.body);
      });
  },

  render: function () {
    return (
      <div id='paperList-footer'>
        <div className='form-footer row'>
          <div className='col-xs-6 dataTable-pagination'>
            <Pagination totalPage={this.props.totalPage} currentPage={this.state.currentPage}
                        onPageChange={this.handlePageChange}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TableFooter;
