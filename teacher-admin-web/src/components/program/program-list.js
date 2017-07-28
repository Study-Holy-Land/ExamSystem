import {Component} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import errorHandler from '../../tool/errorHandler';
import {Modal, Button} from 'react-bootstrap';
import {Pagination} from '../common/';

export default class ProgramList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      copyPointer: -1,
      showModal: false,
      invitationCode: 0,
      invitationCodeList: [],
      programId: 1,
      count: [],
      totalPage: 1,
      currentPage: 1,
      pageCount: 10,
      invitationCodeTypeList: [{type: '全部', activeStatus: 'active'},
        {type: '未使用', activeStatus: ''},
        {type: '已使用', activeStatus: ''}]
    };
  };

  clickProgramList(program) {
    this.props.changeState(program);
  }

  copyToClipboard(e) {
    this.setState({copied: true});
    this.setState({
      copyPointer: e
    });
  }

  onBlurRemovePopup() {
    this.setState({
      currentUriIndex: -1,
      copyPointer: -1
    });
  }

  showCopied(e) {
    return this.state.copyPointer === e ? 'show' : '';
  }

  handleTypeChange(e) {
    const result = this.state.invitationCodeTypeList.map((item, index) => {
      e === index ? item.activeStatus = 'active' : item.activeStatus = '';
      return item;
    });

    this.setState({
      currentPage: 1,
      invitationCodeTypeList: result
    }, () => {
      let status = 2;
      const type = this.state.invitationCodeTypeList.find(item => item.activeStatus === 'active').type;
      if (type === '未使用') {
        status = 0;
      } else if (type === '已使用') {
        status = 1;
      }
      this.showInvitationCode(this.state.programId, status);
    });
  }

  handlePageChange(page) {
    this.setState({
      currentPage: page
    });
    const programId = this.state.programId;
    const type = this.state.invitationCodeTypeList.find(item => item.activeStatus === 'active').type;
    const status = type === '全部' ? 2 : type === '未使用' ? 0 : 1;
    this.showInvitationCode(programId, status, page);
  }

  showInvitationCode(programId, status, page) {
    superagent.get(API_PREFIX + `/programs/${programId}/invitationCodeCount`)
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.setState({
            count: res.body
          }, () => {
            superagent.get(API_PREFIX + `/programs/${programId}/invitationCode`)
              .query({
                status: status,
                page: page,
                pageCount: this.state.pageCount
              })
              .use(noCache)
              .end((err, res) => {
                if (err) {
                  throw err;
                }
                this.setState({
                  invitationCodeList: res.body.items,
                  totalPage: res.body.totalPage,
                  showModal: true,
                  programId: programId
                });
              });
          });
        }
      });
  }

  getInvitationCode() {
    const programId = this.state.programId;
    superagent.post(API_PREFIX + `/programs/${programId}/invitationCode`)
      .use(noCache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.setState({
            invitationCodeTypeList: [{type: '全部', activeStatus: 'active'},
              {type: '未使用', activeStatus: ''},
              {type: '已使用', activeStatus: ''}]
          }, () => {
            this.showInvitationCode(programId, 2);
          });
        }
      });
  };

  hideModal() {
    this.setState({
      showModal: false
    });
  }

  returnProgramInfo(program) {
    const programCode = program.codeEnable ? program.programCode : '此code目前处于禁用状态';
    const programUri = program.uriEnable ? `${DOMAIN}${STUDENT_URI_PREFIX}/?program=${programCode}` : '此注册链接目前处于禁用状态';
    return {programCode, programUri};
  }

  render() {
    const programs = this.props.programs || [];
    const count = this.state.count || [];
    let invitationCodeType = this.state.invitationCodeTypeList.map((item, index) => {
      const codeTypeCount = item.type === '全部' ? count[0] + count[1]
        : item.type === '未使用' ? count[0] : count[1];
      return (<li role='presentation' key={index} className={item.activeStatus}>
        <a onClick={this.handleTypeChange.bind(this, index)}>{item.type}({codeTypeCount})</a>
      </li>);
    });

    const code = this.state.invitationCodeList.map((code, index) => {
      return (
        <tr key={index}>
          <td>{code.invitationCode}</td>
          <td>{code.status === 0 ? '未使用' : '已使用'}</td>
        </tr>
      );
    });
    return (
      <div className='program-list'>
        <table className='table table-bordered table-striped table-hover text-center'>
          <thead>
          <tr>
            <th>名称</th>
            <th>人数</th>
            <th>邀请码URI</th>
            <th>永久邀请码</th>
            <th>一次性邀请码</th>
            <th>导出</th>
          </tr>
          </thead>
          <tbody>
          {
            programs.map((program, index) => {
              const data = {programId: program.programId};
              const href = `${DOMAIN}${API_PREFIX}/reports/1?data=` + encodeURIComponent(JSON.stringify(data));
              const programCode = this.returnProgramInfo(program).programCode;
              const programUri = this.returnProgramInfo(program).programUri;
              const popupUri = this.showCopied(programUri);
              const popupCode = this.showCopied(programCode);
              return (
                <tr key={index} onClick={this.clickProgramList.bind(this, program)}>
                  <td>{program.name}</td>
                  <td>{program.peopleNumber || 0}</td>
                  <td>
                    <div className='input-group'>
                      <input type='text' className='form-control' disabled
                             value={programUri}/>

                      <div className='input-group-addon btn-copy' tabIndex='1'>
                        <CopyToClipboard text={programUri}
                                         onCopy={this.copyToClipboard.bind(this, programUri)}>

                          <div>
                            <button className='popupUri copy-button'
                                    disabled={program.uriEnable ? '' : 'disabled'}
                                    onBlur={this.onBlurRemovePopup.bind(this)}>
                              copy
                            </button>
                            <span className={'popupText ' + popupUri}>Copied !</span>
                          </div>
                        </CopyToClipboard>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className='input-group'>
                      <input type='text' className='form-control' disabled
                             value={programCode}/>

                      <div className='input-group-addon btn-copy' tabIndex='2'>
                        <CopyToClipboard text={programCode}
                                         onCopy={this.copyToClipboard.bind(this, programCode)}>

                          <div>
                            <button className='popup copy-button'
                                    disabled={program.codeEnable ? '' : 'disabled'}
                                    onBlur={this.onBlurRemovePopup.bind(this)}>
                              copy
                            </button>
                            <span className={'popupText ' + popupCode}>Copied !</span>
                          </div>
                        </CopyToClipboard>
                      </div>

                    </div>
                  </td>
                  <td>
                    <button className='btn btn-default'
                            onClick={this.showInvitationCode.bind(this, data.programId, 2, 1)}>
                      管理邀请码
                    </button>
                  </td>
                  <td><a href={href} className='share-postion'><i className='fa fa-share'></i></a></td>
                </tr>
              );
            })
          }
          </tbody>
        </table>

        <div>
          <Modal show={this.state.showModal}>
            <Modal.Header>
              <Modal.Title>
                <div className='inline-title row'>
                  <div className='col-md-4'>
                    <label className='table-header-height pull-left'>邀请码列表</label>
                  </div>
                  <div className='col-md-2 col-md-offset-4'>
                    <button className='btn btn-primary code-button' onClick={this.getInvitationCode.bind(this)}>
                      生成邀请码
                    </button>
                  </div>
                  <div className='col-md-2'>
                    <i className='fa fa-times pull-right' id='red' onClick={this.hideModal.bind(this)}></i>
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='type-header'>
                <ul className='nav nav-tabs'>
                  {invitationCodeType}
                </ul>
              </div>
              <div className='table-style'>
                <table className='table table-striped table-bordered table-hover'>
                  <thead>
                  <tr className='form-title'>
                    <th className='sorting'> 邀请码</th>
                    <th className='sorting'> 状态</th>
                  </tr>
                  </thead>
                  <tbody>
                  {code}
                  </tbody>
                </table>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className='form-footer row'>
                <div className={this.state.totalPage === 0 ? 'hidden dataTable-pagination' : 'dataTable-pagination'}>
                  <Pagination totalPage={this.state.totalPage} currentPage={this.state.currentPage}
                              onPageChange={this.handlePageChange.bind(this)}/>
                </div>
              </div>
              <Button onClick={this.hideModal.bind(this)}>确定</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>

    );
  }
}
