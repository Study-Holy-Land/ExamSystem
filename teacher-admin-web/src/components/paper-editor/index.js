import {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import '../../style/paper-edit.less';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import PaperInfo from '../../containers/paper-editor/PaperInfo';
import LogicPuzzle from '../../containers/paper-editor/LogicPuzzle';
import PaperSubmit from '../../containers/paper-editor/PaperSubmit';
import SectionList from '../../containers/paper-editor/SectionList';
import SectionAddButton from '../../containers/paper-editor/SectionAddButton';
import BasicQuizEditor from '../../containers/paper-editor/basic-quiz-editor';
import UpdateBasicQuiz from '../../containers/paper-editor/update-basic-quiz';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class PaperEditor extends Component {
  constructor(props) {
    super(props);
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.state = {
      isShowBasicQuizEditor: false,
      isShowBasicQuizUpdate: false,
      sectionIndex: -1,
      data: {},
      programType: 'exam',
      isLeaving: 'hidden'
    };
  }

  updateState(sectionIndex) {
    this.setState({
      isShowBasicQuizEditor: !this.state.isShowBasicQuizEditor,
      sectionIndex: sectionIndex
    });
  }

  updateProgramType(programType) {
    this.setState({
      programType
    });
  }

  replaceBasicQuiz(data) {
    this.setState({
      isShowBasicQuizUpdate: !this.state.isShowBasicQuizUpdate,
      data
    });
  }

  routerWillLeave(nextLocation) {
    if (!this.props.paperInfo.isSaved && this.props.paperInfo.hasUnsavedChanges && !this.waitingForConfirm) {
      this.showModal((v) => {
        if (v) {
          this.props.router.push(nextLocation.pathname);
        }
        this.waitingForConfirm = false;
      });
      this.waitingForConfirm = true;
      return false;
    }
  }

  componentDidMount() {
    this.props.router.setRouteLeaveHook(
      this.props.route,
      this.routerWillLeave
    );

    const id = this.props.params.id;

    if (id) {
      superagent
        .get(API_PREFIX + `/paper-definitions/${id}`)
        .use(noCache)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          this.props.initPaperData(res.body);
        });
    }
    superagent
      .get(API_PREFIX + '/stacks')
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.props.initStacks(res.body.items);
        }
      });
  }

  componentWillUnmount() {
    this.props.initPaperData({sections: []});
  }

  showModal(callback) {
    this.callback = callback;
    this.setState({isLeaving: ''});
  }

  hideModal() {
    this.setState({isLeaving: 'hidden'});
    this.callback = null;
  }

  dialogAction(input) {
    if (this.callback) {
      this.callback(input);
    }
    this.hideModal();
  }

  showHeader() {
    if (this.props.paperInfo._id) {
      if (this.props.paperInfo.isDistributed === true) {
        return '查看试卷';
      } else {
        return '修改试卷';
      }
    } else {
      return '新建试卷';
    }
  }

  render() {
    return (
      <div id='paper'>
        <div className='paper-header'>
          {this.showHeader()}
        </div>
        <div className='paper-body'>
          <PaperInfo updateProgramType={this.updateProgramType.bind(this)}
                     isDistributed={this.props.paperInfo.isDistributed}/>
          <LogicPuzzle disabled={this.state.programType === 'practice'}
                       isDistributed={this.props.paperInfo.isDistributed}/>
          <SectionList updateState={this.updateState.bind(this)}
                       replaceBasicQuiz={this.replaceBasicQuiz.bind(this)}
                       isDistributed={this.props.paperInfo.isDistributed}/>
          <div className={this.props.paperInfo.isDistributed ? 'hidden' : ''}>
            <SectionAddButton />
          </div>
          <PaperSubmit isDistributed={this.props.paperInfo.isDistributed}/>
          <BasicQuizEditor isShowBasicQuizEditor={this.state.isShowBasicQuizEditor}
                           sectionIndex={this.state.sectionIndex}
                           updateState={this.updateState.bind(this)}
                           isDistributed={this.props.paperInfo.isDistributed}/>
          <UpdateBasicQuiz isShowBasicQuizUpdate={this.state.isShowBasicQuizUpdate}
                           data={this.state.data}
                           replaceBasicQuiz={this.replaceBasicQuiz.bind(this)}
                           isDistributed={this.props.paperInfo.isDistributed}
          />
        </div>

        <div className={this.state.isLeaving}>
          <div className='static-modal'>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>提示:</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                现在离开当前页面则编辑的内容将会丢失。保存前是否离开当前页面？
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={this.dialogAction.bind(this, false)}>取消</Button>
                <Button bsStyle='primary' onClick={this.dialogAction.bind(this, true)}>确定</Button>
              </Modal.Footer>

            </Modal.Dialog>
          </div>
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(PaperEditor);

