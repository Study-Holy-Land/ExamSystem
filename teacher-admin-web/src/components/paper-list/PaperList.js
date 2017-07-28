import {Component} from 'react';
import TableHeader from '../../components/paper-list/TableHeader';
import PaperForm from './PaperForm';
import TableFooter from '../../components/paper-list/TableFooter';
import superagent from 'superagent';
import {Modal, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import noCache from 'superagent-no-cache';
import constant from '../../../mixin/constant';
import errorHandler from '../../tool/errorHandler';

class PaperList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      paperListTitle: '试卷列表',
      operationButton: false,
      paperList: {},
      showModal: false,
      toDeletePapers: [],
      deleteIds: [],
      sort: 'createTime',
      order: -1,
      spinnerLoading: false
    };
  }

  handleIdChange(ids) {
    this.setState({
      deleteIds: ids,
      operationButton: ids.length
    });
  }

  componentDidMount() {
    let href = window.location.href;
    let pageInfo = href.split('?')[1];
    let page = pageInfo ? pageInfo.split('=')[1] : 1;
    superagent
      .get(API_PREFIX + '/paper-definitions')
      .use(noCache)
      .query({
        page,
        pageCount: 15,
        sort: this.state.sort,
        order: this.state.order
      })
      .use((req) => {
        errorHandler(req);
      })
      .end((err, res) => {
        if (err) {
          throw (err);
        } else {
          this.setState({paperList: res.body}, () => {
            if (this.state.paperList.data.length !== 0) {
              this.setState({spinnerLoading: true});
            } else {
              this.setState({spinnerLoading: 'no list'});
            }
          });
        }
      });
  }

  cancelButton() {
    this.state.toDeletePapers.pop();
    this.setState({
      toDeletePapers: this.state.toDeletePapers,
      showModal: false
    });
  }

  confirmButton() {
    let page;
    if (this.state.paperList.data.length === 1) {
      page = (parseInt(this.props.uri.query.page) - 1) || 1;
    } else {
      page = parseInt(this.props.uri.query.page) || 1;
    }
    this.props.router.push(URI_PREFIX + `/papers?page=${page}`);
    this.paperForm.clearCheckbox();
    if (this.state.toDeletePapers.toString() !== '') {
      this.state.toDeletePapers.forEach(paper => {
        superagent
          .delete(API_PREFIX + '/paper-definitions/' + paper)
          .end((err, res) => {
            if (err) {
              throw (err);
            } else {
              if (res.statusCode === constant.httpCode.NO_CONTENT) {
                superagent
                  .get(API_PREFIX + '/paper-definitions')
                  .query({
                    page: page,
                    pageCount: 15,
                    sort: this.state.sort,
                    order: this.state.order
                  })
                  .end((err, res) => {
                    if (err) {
                      throw (err);
                    } else {
                      this.setState({
                        paperList: res.body
                      }, () => {
                        if (this.state.paperList.data.length !== 0) {
                          this.setState({spinnerLoading: true});
                        } else {
                          this.setState({spinnerLoading: 'no list'});
                        }
                      });
                    }
                  });
              }
            }
          });
      });
    } else {
      superagent.delete(API_PREFIX + '/paper-definitions/deletion')
        .send({idArray: this.state.deleteIds})
        .end((err, res) => {
          if (err) {
            throw (err);
          } else {
            if (res.statusCode === constant.httpCode.NO_CONTENT) {
              superagent
                .get(API_PREFIX + '/paper-definitions')
                .query({
                  page: page,
                  pageCount: 15,
                  sort: this.state.sort,
                  order: this.state.order
                })
                .end((err, res) => {
                  if (err) {
                    throw (err);
                  } else {
                    this.setState({
                      paperList: res.body
                    }, () => {
                      if (this.state.paperList.data.length !== 0) {
                        this.setState({spinnerLoading: true});
                      } else {
                        this.setState({spinnerLoading: 'no list'});
                      }
                    });
                  }
                });
            }
          }
        });
    }
    this.setState({
      showModal: false
    });
  }

  deletePaper(id) {
    this.setState({
      showModal: true,
      toDeletePapers: [...this.state.toDeletePapers, id]
    });
  }

  deletePapers() {
    this.setState({
      showModal: true
    });
  }

  getPaperList(newList) {
    this.paperForm.clearCheckbox();
    this.setState({
      paperList: newList
    });
  }

  handleSortChange(sort, order) {
    this.setState({
      sort,
      order
    }, () => {
      let page = parseInt(this.props.uri.query.page) || 1;
      superagent
        .get(API_PREFIX + '/paper-definitions')
        .use(noCache)
        .query({
          page: page,
          pageCount: 15,
          sort,
          order
        })
        .end((err, res) => {
          if (err) {
            throw (err);
          } else {
            this.setState({
              paperList: res.body
            }, () => {
              if (this.state.paperList.data.length !== 0) {
                this.setState({spinnerLoading: true});
              } else {
                this.setState({spinnerLoading: 'no list'});
              }
            });
          }
        });
    });
  }

  showPaperList() {
    return this.state.spinnerLoading ? '' : 'fa fa-spinner fa-pulse fa-3x';
  }

  render() {
    return (
      <div id='paper-list'>
        <div className='spinner'><i className={this.showPaperList()}> </i></div>

        <TableHeader paperListTitle={this.state.paperListTitle} operationButton={this.state.operationButton}
                     onChangeModal={this.deletePapers.bind(this)}/>
        <div
          className={this.state.spinnerLoading === 'false' || this.state.spinnerLoading === 'no list' ? 'hidden' : ''}>
          <PaperForm sortChange={this.handleSortChange.bind(this)} onIdChange={this.handleIdChange.bind(this)}
                     paperList={this.state.paperList} onDeletePaper={this.deletePaper.bind(this)}
                     ref={(ref) => {
                       this.paperForm = ref;
                     }}/>
          <TableFooter sort={this.state.sort} order={this.state.order} totalPage={this.state.paperList.totalPage}
                       onGetPaperList={this.getPaperList.bind(this)}/>

          <div className={this.state.showModal ? '' : 'hidden'}>
            <div className='static-modal'>

              <Modal.Dialog>
                <Modal.Header>
                  <Modal.Title>删除提示</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  您确定要删除此试卷吗？
                </Modal.Body>

                <Modal.Footer>
                  <Button onClick={this.cancelButton.bind(this)}>取消</Button>
                  <Button bsStyle='primary' onClick={this.confirmButton.bind(this)}>确定</Button>
                </Modal.Footer>

              </Modal.Dialog>
            </div>
          </div>
        </div>
        <div className={this.state.spinnerLoading === 'no list' ? 'no-result' : 'hidden'}>无列表记录</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(withRouter(PaperList));
