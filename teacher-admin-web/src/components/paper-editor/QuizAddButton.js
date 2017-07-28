import {Component} from 'react';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import {Modal, Button} from 'react-bootstrap';
import '../../style/paper-edit.less';
import Rx from 'rx';
import initMoment from '../../tool/init-moment';

export default class QuizeAddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      homeworkList: [],
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
    const type = this.state.homeworkTypes[0].title;

    this.setState({
      show: true
    }, () => {
      Rx.Observable.fromEvent(this.searchName, 'keyup')
        .pluck('target', 'value')
        .map(text => text.trim())
        .debounce(500)
        .distinctUntilChanged()
        .forEach((text) => {
          if (text.length <= 2) {
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
          } else {
            superagent
              .get(API_PREFIX + '/homeworks')
              .use(noCache)
              .query({
                homeworkName: text,
                type
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

  putHomeworkQuiz() {
    this.hideModal();
    let quizzes = [];
    let items = this.state.homeworkList.filter((item) => {
      return item.checked === true;
    });
    items.forEach((item) => {
      if (item.checked && item.disabled === false) {
        let quizId = parseInt(item.id);
        let quiz = this.state.homeworkList.find(({id}) => id === quizId);
        quizzes.push({
          uri: quiz.uri,
          id: quizId
        });
      }
    });
    this.props.editHomework({
      quizzes,
      sectionIndex: this.props.sectionIndex
    });
    this.props.editPaper({hasUnsavedChanges: true});
  }

  wrapHomeworkList(homeworkList) {
    return homeworkList.map((item) => {
      let checkId;
      let checked = false;
      let disabled = false;
      this.props.sections.forEach((section) => {
        let homeworkQuizzes = section.quizzes || [];
        checkId = homeworkQuizzes.some((quiz) => quiz.id === item.id && quiz.uri.split('/')[0] === 'homeworkQuizzes');
        if (checkId) {
          checked = checkId;
          disabled = checkId;
        }
      });
      return Object.assign({}, item, {checked, disabled});
    });
  }

  handleCheckboxChange(e) {
    const id = parseInt(e.target.value);
    const checked = e.target.checked;
    const homeworkList = this.state.homeworkList.map(item => {
      return Object.assign({}, item, {
        checked: item.id === id ? checked : item.checked
      });
    });
    this.setState({
      homeworkList
    });
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

  render() {
    const homeworkList = this.state.homeworkList || [];
    let homeworkListHTML = homeworkList.map(({checked, disabled, homeworkName, stackId, makerName, createTime, id}, index) => {
      const title = this.state.homeworkTypes.find(item => item.stackId === stackId).title;
      const showTime = initMoment(createTime);
      return <tr key={index}>
        <th scope='row'>
          <input disabled={disabled}
                 type='checkbox' name='homework'
                 value={id}
                 checked={checked}
                 onChange={this.handleCheckboxChange.bind(this)
                 }/>
        </th>
        <td> {homeworkName}</td>
        <td> {title}</td>
        <td> {makerName}</td>
        <td>{showTime}</td>
      </tr>;
    });

    const noResult = <div className='center-block'>没有找到相应的结果</div>;
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

    return (
      <div className='add-section'>
        <i className='fa fa-plus fa-small' onClick={this.props.isDistributed ? '' : this.handleClick.bind(this)}></i>

        <Modal {...this.props}
               show={this.state.show}>
          <Modal.Header id='contained-modal-title-lg'>
            <Modal.Title>
              <label className='col-sm-3 table-header-height'>试题列表</label>
              <i className='fa fa-times pull-right' id='red' onClick={this.hideModal.bind(this)}></i>
            </Modal.Title>
          </Modal.Header>
          <div className='inline-title turn-right'>
            <label>搜索</label>
            <input type='text' className='form-width form-control' placeholder='请至少输入3个字符'
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
            { this.state.show && this.state.totalPage !== 0
              ? <div className='table-style'>
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
              : noResult}

          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.putHomeworkQuiz.bind(this)}>确定</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}
