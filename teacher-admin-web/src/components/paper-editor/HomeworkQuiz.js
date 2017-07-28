import {Component} from 'react';
import '../../style/paper-edit.less';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import {Modal, Button} from 'react-bootstrap';
import Rx from 'rx';
import initMoment from '../../tool/init-moment';
import {DropTarget, DragSource} from 'react-dnd';
import {findDOMNode} from 'react-dom';
import flow from 'lodash/flow';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    const clientOffset = monitor.getClientOffset();

    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    props.moveCard(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  }
};

class HomeworkQuiz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      homeworkName: '',
      homeworkType: '',
      homeworkList: [],
      homeworkId: '',
      homeworkTypes: [{activeStatus: 'active', title: '全部', stackId: null}],
      selectedIndex: 0
    };
  }

  initHomeworkTypes() {
    let stacks = this.props.stacks.map((item) => {
      return Object.assign({}, item, {activeStatus: ''});
    });
    const primaryTypes = [{activeStatus: 'active', title: '全部', stackId: null}];
    const homeworkTypes = primaryTypes.concat(stacks);

    this.setState({homeworkTypes});
  }

  handleClick() {
    this.initHomeworkTypes();

    const stackId = this.state.homeworkTypes.find(item => item.activeStatus === 'active').stackId;
    this.setState({
      show: true
    }, () => {
      Rx.Observable.fromEvent(this.searchName, 'keyup')
        .pluck('target', 'value')
        .map(text => text.trim())
        .debounce(500)
        .distinctUntilChanged()
        .forEach((text) => {
          if (text.length >= 2) {
            superagent
              .get(API_PREFIX + '/homeworks')
              .use(noCache)
              .query({
                homeworkName: text,
                stackId
              })
              .end((err, res) => {
                if (err) {
                  throw err;
                } else {
                  this.setState({
                    homeworkList: this.wrapHomeworkList(res.body.homeworkList)
                  });
                }
              });
          } else {
            superagent
              .get(API_PREFIX + '/homeworks')
              .use(noCache)
              .end((err, res) => {
                if (err) {
                  throw err;
                } else {
                  this.setState({
                    homeworkList: this.wrapHomeworkList(res.body.homeworkList)
                  });
                }
              });
          }
        });
    });
    superagent
      .get(API_PREFIX + '/homeworks')
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.setState({
            homeworkList: this.wrapHomeworkList(res.body.homeworkList)
          });
        }
      });
  }

  hideModal() {
    this.setState({
      show: false
    });
  }

  wrapHomeworkList(homeworkList) {
    return homeworkList.map(item => {
      return Object.assign({}, item, {
        checked: item.id === this.state.homeworkId
      });
    });
  }

  handleRadioChange(e) {
    const id = parseInt(e.target.value);
    const checked = e.target.checked;
    const homeworkList = this.state.homeworkList.map(item => {
      return Object.assign({}, item, {
        checked: item.id === id ? checked : false
      });
    });

    this.setState({
      homeworkList
    });
  }

  receiveHomeworkName(uri) {
    if (uri) {
      const uriArray = uri.split('/');
      superagent
        .get(API_PREFIX + `/homework-quizzes/${uriArray[1]}`)
        .use(noCache)
        .end((err, res) => {
          if (err) {
            throw err;
          } else {
            const title = this.props.stacks.find(item => item.stackId === res.body.stackId).title;
            this.setState({
              homeworkName: res.body.homeworkName,
              homeworkType: title,
              homeworkId: res.body.id
            });
          }
        });
    }
  }

  handleTypeChange(index) {
    this.setState({
      selectedIndex: index
    });
    const result = this.state.homeworkTypes.map((item, i) => {
      i === index ? item.activeStatus = 'active' : item.activeStatus = '';
      return item;
    });

    const stackId = result.find(item => item.activeStatus === 'active').stackId;
    superagent
      .get(API_PREFIX + '/homeworks')
      .use(noCache)
      .query({
        homeworkName: this.searchName.value,
        stackId
      })
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.setState({
            homeworkList: this.wrapHomeworkList(res.body.homeworkList)
          });
        }
      });
  }

  componentDidMount() {
    this.receiveHomeworkName(this.props.uri);
  }

  componentWillReceiveProps(next) {
    this.receiveHomeworkName(next.uri);
  }

  removeHomeworkQuiz(sectionIndex, homeworkQuizIndex) {
    const data = {sectionIndex, homeworkQuizIndex};
    this.props.onRemoveHomeworkQuiz(data);
    this.props.editPaper({hasUnsavedChanges: true});
  }

  replaceHomeworkQuiz(sectionIndex, homeworkQuizIndex) {
    this.hideModal();
    let quiz = {};

    let items = this.state.homeworkList.filter((item) => {
      return item.checked === true;
    });

    if (items[0] && items[0].checked) {
      let quizId = parseInt(items[0].id);
      let uri = this.state.homeworkList.find(({id}) => id === quizId).uri;
      quiz = {
        uri,
        id: quizId
      };
    }

    const data = {sectionIndex, homeworkQuizIndex, quiz};
    this.props.onReplaceHomeworkQuiz(data);
    this.props.editPaper({hasUnsavedChanges: true});
  }

  render() {
    const homeworkName = this.state.homeworkName;
    const homeworkType = this.state.homeworkType;
    let {sectionIndex, homeworkQuizIndex, sections} = this.props;
    const homeworkList = this.state.homeworkList || [];
    sections = sections.filter(({type}) => {
      return type !== 'logicQuiz';
    });
    let homeworkListHTML = homeworkList.map(({checked, homeworkName, stackId, makerName, createTime, id, uri}, index) => {
      let disabled = (sections[sectionIndex].quizzes.find((quiz) => {
        return quiz.id === id;
      })) ? 'disabled' : '';
      const title = this.state.homeworkTypes.find(item => item.stackId === stackId).title;
      const inputHtml = <input
        disabled={disabled}
        type='radio'
        name='homework'
        checked={checked}
        onChange={this.handleRadioChange.bind(this)}
        value={id}/>;
      const showTime = initMoment(createTime);
      return <tr key={index}>
        <th scope='row'>
          {inputHtml}
        </th>
        <td>{homeworkName}</td>
        <td>{title}</td>
        <td>{makerName}</td>
        <td>{showTime}</td>
      </tr>;
    });

    let homeworkTypeList = this.state.homeworkTypes.map((item, index) => {
      const active = this.state.selectedIndex === index ? 'label-primary' : 'label-default';
      return (
        <span className={'label ' + active}
              key={index}
              onClick={this.handleTypeChange.bind(this, index)}>
        {item.title}
        </span>
      );
    });

    const {connectDragSource, connectDropTarget} = this.props;

    return (
      connectDragSource(connectDropTarget(<div className='col-md-2 col-xs-4 padding-width'>
        <div className='homework-title'>
          <div className='title-style'>
            <h5 className='title-header no-margin'>
              {homeworkName}
            </h5>
          </div>
          <div className='homework-type'>
            <span>{homeworkType}</span>
          </div>
          <div className='fa-icon pull-right'>
            <i className='fa fa-cog'
               onClick={this.props.isDistributed ? '' : this.handleClick.bind(this)}></i>
            <i className='fa fa-trash-o'
               onClick={this.props.isDistributed ? '' : this.removeHomeworkQuiz.bind(this, sectionIndex, homeworkQuizIndex)}> </i>
          </div>
        </div>

        <Modal show={this.state.show}>
          <Modal.Header id='contained-modal-title-lg'>
            <Modal.Title>
              <div className='inline-title'>
                <label className='col-sm-3 table-header-height'>试题列表</label>
                <i className='fa fa-times pull-right' id='red' onClick={this.hideModal.bind(this)}></i>
              </div>
            </Modal.Title>
          </Modal.Header>
          <div className='inline-title turn-right'>
            搜索
            <input type='text' className='form-control' placeholder='请至少输入3个字符'
                   ref={(ref) => {
                     this.searchName = ref;
                   }}
            />
          </div>

          <Modal.Body>
            <div className='type-header'>
              <h4 className='margin-border'>
                {homeworkTypeList}
              </h4>
            </div>
            <div className='table-style'>
              <table className='table table-striped table-bordered table-hover'>
                <thead>
                <tr className='form-title'>
                  <th></th>
                  <th className='sorting'> 题目名称</th>
                  <th className='sorting'> 题目类型</th>
                  <th className='sorting'> 创建者</th>
                  <th className='sorting'> 创建时间</th>
                </tr>
                </thead>
                <tbody>
                {homeworkListHTML}
                </tbody>
              </table>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.replaceHomeworkQuiz.bind(this, sectionIndex, homeworkQuizIndex)}>确定修改</Button>
          </Modal.Footer>
        </Modal>

      </div>))
    );
  }
}

export default flow(DropTarget('homework', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
})), DragSource('homework', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})))(HomeworkQuiz);
