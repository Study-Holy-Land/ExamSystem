import {Component} from 'react';
import superagent from 'superagent';
import '../../style/paper-edit.less';
import {Modal, Button} from 'react-bootstrap';
import constant from '../../../mixin/constant';

export default class PaperSubmit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreated: this.props.data._id ? '修改' : '新建',
      saveOrRelease: '',
      message: '',
      isSpinnerSave: false,
      isSpinnerRelease: false,
      isSpinnerUnRelease: false,
      isHidden: true,
      saveDisabled: '',
      releaseDisabled: '',
      showModal: true,
      judgeDelete: true
    };
  }

  componentWillReceiveProps(next) {
    if (next.data.isDistributed) {
      this.setState({
        saveDisabled: 'disabled',
        releaseDisabled: 'disabled'
      });
    } else {
      this.setState({
        saveDisabled: '',
        releaseDisabled: ''
      });
    }
  }

  checkPaperNameAndDesc() {
    const paperData = this.props.data;

    if (paperData.paperName && paperData.paperName.length > constant.maxLength.TITLE) {
      return '试卷名称过长';
    } else if (paperData.description && paperData.description.length > constant.maxLength.DESCRIPTION) {
      return '试卷描述过长';
    } else if (!paperData.paperName) {
      return '试卷名称不能为空';
    }
    return '';
  }

  checkSectionsLength() {
    if (this.props.data.sections.length === 0) {
      return '试卷不能为空';
    }
    return '';
  }

  checkLogicQuizLessThanZero(quizzes) {
    if (quizzes.easy < 0 || quizzes.hard < 0 || quizzes.normal < 0) {
      return '逻辑题题数不能小于零';
    }
  }

  checkLogicQuizHaveDecimal(quizzes) {
    if (quizzes.easy % 1 !== 0 || quizzes.hard % 1 !== 0 || quizzes.normal % 1 !== 0) {
      return '逻辑题题数不能为小数';
    }
  }

  checkLogicQuizHaveEmpty(quizzes) {
    if (quizzes.easy === 0 && quizzes.hard === 0 && quizzes.normal === 0) {
      return '不能存在空的逻辑题部分';
    }
  }

  checkLogicQuizCount() {
    const paperData = this.props.data;
    if (paperData.sections.length >= 1 && paperData.sections[0].type === 'logicQuiz') {
      const quizzes = paperData.sections[0].quizzes;
      this.checkLogicQuizLessThanZero(quizzes);
      this.checkLogicQuizHaveDecimal(quizzes);
      this.checkLogicQuizHaveEmpty(quizzes);
    }
    return '';
  }

  checkSectionsVacancy() {
    const paperData = this.props.data;
    if (paperData.sections.length >= 1) {
      const element = paperData.sections.find(item => {
        return item.quizzes.length === 0;
      });
      if (element) {
        return '试卷不能存在空的部分';
      }
    }
    return '';
  }

  save() {
    const paperData = this.props.data;
    paperData.paperType = paperData.paperType || 'practice';
    const checkList = [this.checkPaperNameAndDesc(), this.checkSectionsLength(), this.checkLogicQuizCount(), this.checkSectionsVacancy()];
    const message = checkList.find(item => {
      return item !== '';
    });
    if (message) {
      this.setState({showModal: false, message: message});
    } else {
      this.setState({isSpinnerSave: true, saveDisabled: 'disabled', showModal: true});

      if (paperData._id) {
        superagent
          .put(API_PREFIX + `/paper-definitions/${paperData._id}`)
          .set('Content-Type', 'application/json')
          .send({
            data: paperData
          })
          .end((err, res) => {
            if (res.statusCode === constant.httpCode.NO_CONTENT) {
              this.props.addPaperId({isSaved: true, hasUnsavedChanges: false});
              this.setState({isSpinnerSave: false, isHidden: false, saveOrRelease: '保存'});
            } else {
              throw err;
            }
          });
      } else {
        superagent
          .post(API_PREFIX + '/paper-definitions')
          .set('Content-Type', 'application/json')
          .send({
            data: paperData
          })
          .end((err, res) => {
            if (res.statusCode === constant.httpCode.CREATED) {
              this.props.addPaperId({_id: res.body.paperId, isSaved: true, hasUnsavedChanges: false});
              this.props.router.push(URI_PREFIX + `/papers/${res.body.paperId}/edit`);
              this.setState({isSpinnerSave: false, isHidden: false, saveOrRelease: '保存'});
            } else {
              throw err;
            }
          });
      }
    }
  }

  release() {
    const paperData = this.props.data;
    paperData.paperType = paperData.paperType || 'practice';
    if (paperData._id) {
      this.setState({
        isSpinnerRelease: true
      });
      superagent
        .put(API_PREFIX + `/paper-definitions/${paperData._id}/distribution`)
        .set('Content-Type', 'application/json')
        .send({
          data: paperData
        })
        .end((err, res) => {
          if (res.statusCode === constant.httpCode.NO_CONTENT) {
            this.props.addPaperId({isSaved: true, hasUnsavedChanges: false});
            this.setState({
              isSpinnerRelease: false,
              isHidden: false,
              saveOrRelease: '发布',
              saveDisabled: 'disabled',
              releaseDisabled: 'disabled'
            });
          } else {
            throw err;
          }
        });
    } else {
      const checkList = [this.checkPaperNameAndDesc(), this.checkSectionsLength(), this.checkLogicQuizCount(), this.checkSectionsVacancy()];
      const message = checkList.find(item => {
        return item !== '';
      });
      if (message) {
        this.setState({showModal: false, message: message});
      } else {
        this.setState({
          isSpinnerRelease: true,
          showModal: true
        });

        superagent
          .post(API_PREFIX + '/paper-definitions')
          .set('Content-Type', 'application/json')
          .send({
            data: paperData
          })
          .end((err, res) => {
            if (res.statusCode === constant.httpCode.CREATED) {
              this.props.addPaperId({_id: res.body.paperId, isSaved: true, hasUnsavedChanges: false});
              this.props.router.push(URI_PREFIX + `/papers/${res.body.paperId}/edit`);
              const data = this.props.data;
              superagent
                .put(API_PREFIX + `/paper-definitions/${data._id}/distribution`)
                .set('Content-Type', 'application/json')
                .send({
                  data: data
                })
                .end((error, resp) => {
                  if (resp.statusCode === constant.httpCode.NO_CONTENT) {
                    this.setState({
                      isSpinnerRelease: false,
                      isHidden: false,
                      saveOrRelease: '发布',
                      saveDisabled: 'disabled',
                      releaseDisabled: 'disabled'
                    });
                  } else {
                    throw error;
                  }
                });
            } else {
              throw err;
            }
          });
      }
    }
  }

  goToLists() {
    this.props.router.push(URI_PREFIX + '/papers');
  }

  continueAddPaper() {
    this.props.initPaperData({sections: []});
    this.setState({
      isSpinnerSave: false,
      isSpinnerRelease: false,
      isHidden: true,
      saveDisabled: '',
      releaseDisabled: ''
    });
    this.props.router.push(URI_PREFIX + '/papers/new');
  }

  onConfirm() {
    this.setState({showModal: true});
  }

  deletePaper() {
    this.setState({
      judgeDelete: false
    });
  }

  cancelModal() {
    this.setState({
      judgeDelete: true
    });
  }

  confirmModal() {
    const paperId = window.location.pathname.split('/')[3];
    superagent
      .delete(API_PREFIX + '/paper-definitions/' + paperId)
      .end((err, res) => {
        if (err) {
          throw (err);
        } else {
          if (res.statusCode === constant.httpCode.NO_CONTENT) {
            this.props.router.push(URI_PREFIX + '/papers?page=1');
          }
        }
      });
  }

  judgeSave() {
    return this.state.isSpinnerSave ? 'fa fa-spinner fa-spin' : '';
  }

  judgeRelease() {
    return this.state.isSpinnerRelease ? 'fa fa-spinner fa-spin' : '';
  }

  judgeUndistribute() {
    return this.state.isSpinnerUnRelease ? 'fa fa-spinner fa-spin' : '';
  }

  judgeHidden() {
    return this.state.isHidden ? 'hidden' : 'row no-margin-left-right form-group ';
  }

  judgeShowModal() {
    return this.state.showModal ? 'hidden' : 'alert alert-warning row col-sm-6 col-sm-offset-3';
  }

  render() {
    return (
      <div className='row'>
        <div id='paper-submit'>
          <div className='col-md-3 col-md-offset-1 col-sm-3 col-sm-offset-1 col-xs-3 col-xs-offset-1 text-center'>
            <button className='btn btn-primary btn-save' disabled={this.state.saveDisabled}
                    onClick={this.save.bind(this)}>{'保存  '}
              <i className={this.judgeSave()}> </i>
            </button>
          </div>
          <div className='col-md-3 col-sm-3 col-xs-3 text-center'>
            <button className='btn btn-primary btn-release' disabled={this.state.releaseDisabled}
                    onClick={this.release.bind(this)}>{'发布  '}
              <i className={this.judgeRelease()}> </i>
            </button>
          </div>
          <div className='col-md-3 col-sm-3 col-xs-3 text-center'>
            <button className='btn btn-primary btn-release'
                    onClick={this.deletePaper.bind(this)}>{'删除  '}
              <i className={this.judgeUndistribute()}> </i>
            </button>
          </div>

          <div className={this.judgeHidden()}>
            <div className='alert alert-block alert-success col-sm-6 col-sm-offset-3 no-margin-bottom text-center'>
              <p className='message-hint'>
                <i className='ace-icon fa fa-check-circle icon-space'> </i>
                {`试卷${this.state.saveOrRelease}成功,请选择查看试卷列表还是继续${this.state.isCreated}试卷?`}
              </p>
              <button className='btn btn-sm btn-success icon-space' onClick={this.goToLists.bind(this)}>查看试卷列表
              </button>
              <button className='btn btn-sm btn-default col-sm-offset-2'
                      onClick={this.continueAddPaper.bind(this)}>{`继续${this.state.isCreated}试卷`}</button>
            </div>
          </div>

        </div>
        <div className={this.judgeShowModal()}>
          <div className='col-sm-5'>
            <strong> <i className='fa fa-warning warning-icon'> </i></strong>
            {this.state.message}
          </div>
          <div className='pull-right'>
            <button type='button' className='close' onClick={this.onConfirm.bind(this)}>
              <i className='ace-icon fa fa-times'> </i>
            </button>
          </div>
        </div>

        <div className={this.state.judgeDelete ? 'hidden' : ''}>
          <div className='static-modal'>

            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>删除提示</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                您确定要删除此试卷吗？
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={this.cancelModal.bind(this)}>取消</Button>
                <Button bsStyle='primary' onClick={this.confirmModal.bind(this)}>确定</Button>
              </Modal.Footer>

            </Modal.Dialog>
          </div>
        </div>
      </div>
    );
  }
}
