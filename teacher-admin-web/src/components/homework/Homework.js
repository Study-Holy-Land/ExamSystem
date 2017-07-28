import {Component} from 'react';
import superagent from 'superagent';
import HomeworkTable from './HomeworkTable';
import TableHeader from './TableHeader';
import TableFooter from './TableFooter';
import {Modal, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import '../../style/homework.less';
import noCache from 'superagent-no-cache';
import constant from '../../../mixin/constant';

class Homework extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Title: '试题列表',
      homework: [],
      totalPage: '',
      operationButton: false,
      showModal: false,
      ids: [],
      pageCount: 15,
      sort: 'createTime',
      order: -1,
      spinnerLoading: false
    };
  }

  componentDidMount() {
    this.props.router.push(URI_PREFIX + '/homeworks' + '?page=1');
    let page = parseInt(this.props.uri.query.page) || 1;
    this.getHomeworkDefinitionList(page);
  }

  getHomeworkDefinitionList(page) {
    superagent
        .get(API_PREFIX + '/homework-definitions')
        .use(noCache)
        .query({
          page,
          pageCount: this.state.pageCount,
          sort: this.state.sort,
          order: this.state.order
        })
        .end((err, res) => {
          if (err) {
            throw err;
          } else {
            this.setState({
              homework: res.body.data,
              totalPage: res.body.totalPage
            }, () => {
              if (this.state.homework.length !== 0) {
                this.setState({spinnerLoading: true});
              } else {
                if (this.props.uri.query.page === '1') {
                  this.setState({spinnerLoading: 'no list'});
                }
              }
            });
          }
        });
  }

  handleIdChange(ids) {
    this.setState({
      operationButton: ids.length,
      ids: ids
    });
  }

  handleChangeModal() {
    this.setState({
      showModal: true
    });
  }

  deleteHomework(homeworkId) {
    this.setState({
      showModal: true,
      ids: [...this.state.ids, homeworkId]
    });
  }

  onCancelButton() {
    this.setState({
      ids: [],
      showModal: false
    });
  }

  onConfirmButton() {
    let page = parseInt(this.props.uri.query.page) || 1;
    this.homeworkTable.clearCheckbox();
    if (this.state.ids.length === 1) {
      superagent
          .delete(API_PREFIX + '/homework-definitions/' + this.state.ids[0])
          .end((err, res) => {
            if (err) {
              throw err;
            } else {
              if (res.statusCode === constant.httpCode.NO_CONTENT) {
                superagent
                    .get(API_PREFIX + '/homework-definitions')
                    .query({
                      page: page,
                      pageCount: this.state.pageCount,
                      sort: this.state.sort,
                      order: this.state.order
                    })
                    .end((err, res) => {
                      if (err) {
                        throw err;
                      } else {
                        this.setState({
                          homework: res.body.data,
                          totalPage: res.body.totalPage
                        }, () => {
                          if (this.state.homework.length !== 0) {
                            this.setState({spinnerLoading: true});
                          } else {
                            if (this.props.uri.query.page === '1') {
                              this.setState({spinnerLoading: 'no list'});
                            } else {
                              const newPage = parseInt(this.props.uri.query.page) - 1;
                              this.props.router.push(URI_PREFIX + '/homeworks' + '?page=' + newPage);
                              this.getHomeworkDefinitionList(newPage);
                            }
                          }
                        });
                      }
                    });
              }
            }
          });
    } else {
      superagent
          .delete(API_PREFIX + '/homework-definitions/deletion')
          .send({idArray: this.state.ids})
          .end((err, res) => {
            if (err) {
              throw err;
            } else {
              if (res.statusCode === constant.httpCode.NO_CONTENT) {
                superagent
                    .get(API_PREFIX + '/homework-definitions')
                    .use(noCache)
                    .query({
                      page: page,
                      pageCount: this.state.pageCount,
                      sort: this.state.sort,
                      order: this.state.order
                    })
                    .end((err, res) => {
                      if (err) {
                        throw err;
                      } else {
                        this.setState({
                          homework: res.body.data,
                          totalPage: res.body.totalPage
                        }, () => {
                          if (this.state.homework.length !== 0) {
                            this.setState({spinnerLoading: true});
                          } else {
                            if (this.props.uri.query.page === '1') {
                              this.setState({spinnerLoading: 'no list'});
                            } else {
                              const newPage = parseInt(this.props.uri.query.page) - 1;
                              this.props.router.push(URI_PREFIX + '/homeworks' + '?page=' + newPage);
                              this.getHomeworkDefinitionList(newPage);
                            }
                          }
                        });
                      }
                    });
              }
            }
          });
    }
    this.setState({
      showModal: false,
      ids: []
    });
  }

  getHomework(list) {
    this.homeworkTable.clearCheckbox();
    this.setState({
      homework: list
    });
  }

  handleSortChange(sort, order) {
    this.setState({
      sort,
      order
    }, () => {
      superagent
          .get(API_PREFIX + '/homework-definitions')
          .use(noCache)
          .query({
            page: this.state.page,
            pageCount: this.state.pageCount,
            sort: this.state.sort,
            order: this.state.order
          })
          .end((err, res) => {
            if (err) {
              throw err;
            } else {
              this.setState({
                homework: res.body.data,
                totalPage: res.body.totalPage
              }, () => {
                if (this.state.homework.length !== 0) {
                  this.setState({spinnerLoading: true});
                } else {
                  if (this.props.uri.query.page === '1') {
                    this.setState({spinnerLoading: 'no list'});
                  } else {
                    const newPage = parseInt(this.props.uri.query.page) - 1;
                    this.props.router.push(URI_PREFIX + '/homeworks' + '?page=' + newPage);
                    superagent
                        .get(API_PREFIX + '/homework-definitions')
                        .use(noCache)
                        .query({
                          page: newPage,
                          pageCount: this.state.pageCount,
                          sort: this.state.sort,
                          order: this.state.order
                        })
                        .end((err, res) => {
                          if (err) {
                            throw err;
                          } else {
                            this.setState({
                              homework: res.body.data,
                              totalPage: res.body.totalPage
                            }, () => {
                              if (this.state.homework.length !== 0) {
                                this.setState({spinnerLoading: true});
                              } else {
                                if (this.props.uri.query.page === '1') {
                                  this.setState({spinnerLoading: 'no list'});
                                } else {
                                  const newPage = parseInt(this.props.uri.query.page) - 1;
                                  this.props.router.push(URI_PREFIX + '/homeworks' + '?page=' + newPage);
                                  this.getHomeworkDefinitionList(newPage);
                                }
                              }
                            });
                          }
                        });
                  }
                }
              });
            }
          });
    });
  }

  render() {
    return (
        <div>
          <TableHeader Title={this.state.Title} operationButton={this.state.operationButton}
                       onChangeModal={this.handleChangeModal.bind(this)}/>
          <div className={!this.state.spinnerLoading || this.state.spinnerLoading === 'no list' ? 'hidden' : ''}>
            <HomeworkTable sortChange={this.handleSortChange.bind(this)} homework={this.state.homework}
                           onIdChange={this.handleIdChange.bind(this)}
                           handleDeleteHomework={this.deleteHomework.bind(this)}
                           ref={(ref) => {
                             this.homeworkTable = ref;
                           }}/>

            <TableFooter sort={this.state.sort} order={this.state.order} totalPage={this.state.totalPage}
                         onGetHomework={this.getHomework.bind(this)}/>

            <div className={this.state.showModal ? '' : 'hidden'}>
              <div className='dialog'>
                <Modal.Dialog>
                  <Modal.Header>
                    <Modal.Title>删除提示</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    您确定要删除此试题吗？
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={this.onCancelButton.bind(this)}>取消</Button>
                    <Button bsStyle='primary' onClick={this.onConfirmButton.bind(this)}>确定</Button>
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

export default connect(mapStateToProps)(withRouter(Homework));
