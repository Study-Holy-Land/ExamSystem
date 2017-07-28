import {Component} from 'react';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import {PaginationWrapper} from '../common/';

export default class TableFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageCount: 15
    };
  }

  handlePageChange(page) {
    superagent
      .get(API_PREFIX + '/students')
      .use(noCache)
      .query({
        page,
        pageCount: this.state.pageCount
      })
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.props.onGetPaperList(res.body);
      });
  }

  render() {
    return (
      <div id='paperList-footer'>
        <div className='form-footer row'>
          <div className='col-xs-6 dataTable-pagination'>
            <PaginationWrapper totalPage={this.props.totalPage} currentPage={this.state.currentPage}
                               onPageChange={this.handlePageChange.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}
