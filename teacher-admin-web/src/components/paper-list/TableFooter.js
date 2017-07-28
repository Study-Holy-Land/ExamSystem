import {Component} from 'react';
import '../../style/paperList.less';
import {PaginationWrapper} from '../common/';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';

export default class TableFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageCount: 15,
      sort: this.props.sort,
      order: this.props.order
    };
  }

  handlePageChange(page) {
    superagent
      .get(API_PREFIX + '/paper-definitions')
      .use(noCache)
      .query({
        page: page,
        pageCount: this.state.pageCount,
        sort: this.state.sort,
        order: this.state.order
      })
      .end((err, res) => {
        if (err) {
          throw (err);
        } else {
          this.props.onGetPaperList(res.body);
        }
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
