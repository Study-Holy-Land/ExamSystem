import {Component} from 'react';
import '../../style/homework.less';
import {Link} from 'react-router';
import {SortField} from '../common';
import initMoment from '../../tool/init-moment';

class HomeworkTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectAll: false,
      selectBox: []
    };
  }

  editHomework(homeworkId) {
    this.props.router.push(URI_PREFIX + '/homeworks/' + homeworkId + '/edit');
  }

  deleteHomework(homeworkId) {
    this.props.handleDeleteHomework(homeworkId);
  }

  getSelectedIds() {
    return this.props.homework.filter((item, key) => {
      return this.state.selectBox[key];
    }).map(item => item._id);
  }

  onSelectAll() {
    let selectAll = !this.state.selectAll;
    let selectBox = this.props.homework.map(item => selectAll);
    this.setState({
      selectAll,
      selectBox
    }, () => {
      this.props.onIdChange(this.getSelectedIds());
    });
  }

  onCheckbox(index) {
    let selectBox = this.props.homework.map((item, idx) => this.state.selectBox[idx]);
    selectBox[index] = !selectBox[index];
    let selectAll = selectBox.every((item) => item);
    this.setState({
      selectBox,
      selectAll
    }, () => {
      this.props.onIdChange(this.getSelectedIds());
    });
  }

  handleChange(sort, order) {
    this.props.sortChange(sort, order);
  }

  clearCheckbox() {
    this.setState({
      selectBox: [],
      selectAll: false
    });
  }

  render() {
    let fields = [
      {
        name: '名称',
        isNeedSort: true,
        sort: 'name'
      }, {
        name: 'github 地址',
        isNeedSort: false,
        sort: 'git'
      }, {
        name: '创建者',
        isNeedSort: true,
        sort: 'creator'
      }, {
        name: '创建时间',
        isNeedSort: true,
        sort: 'createTime'
      }, {
        name: '状态',
        isNeedSort: true,
        sort: 'status'
      }, {
        name: '类型',
        isNeedSort: false,
        sort: 'title'
      }, {
        name: '操作',
        isNeedSort: false,
        sort: 'operate'
      }
    ];

    const homeworkList = this.props.homework || [];
    const homeworkHTML = homeworkList.map(({_id, stack, name, definitionRepo, status, makerName, createTime}, index) => {
      switch (status) {
        case 0:
          status = '创建失败';
          break;
        case 1:
          status = '正在创建';
          break;
        case 2:
          status = '创建成功';
          break;
      }
      const time = initMoment(createTime);
      return (
        <tr key={index}>
          <td><input type='checkbox' checked={this.state.selectBox[index]} className='checkbox-item'
                     onClick={this.onCheckbox.bind(this, index)}/></td>
          <td>{name}</td>
          <td>
            <div className='over-line'>{definitionRepo}</div>
          </td>
          <td>{makerName}</td>
          <td>{time}</td>
          <td>{status}</td>
          <td>{stack.title}</td>
          <td>
            <div>
              <Link className='green'
                    to={URI_PREFIX + '/homeworks/' + _id + '/edit'}><i
                className='fa fa-pencil bigger'/></Link>
              <Link className='red' onClick={this.deleteHomework.bind(this, _id)}><i
                className='fa fa-trash-o bigger'/></Link>
            </div>
          </td>
        </tr>);
    });
    return (
      <div className='homeworks row' id='homeworks'>
        <div className='list-table'>
          <table className='table table-striped table-hover table-bordered'>
            <thead>

            <SortField fields={fields} currentStateIndex={3} checked={this.state.selectAll || false}
                       onChange={this.onSelectAll.bind(this)}
                       sortChange={this.handleChange.bind(this)}/>

            </thead>
            <tbody>
            {homeworkHTML}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default HomeworkTable;
