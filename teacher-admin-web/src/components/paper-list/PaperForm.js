import {Component} from 'react';
import '../../style/paperList.less';
import {Link} from 'react-router';
import {SortField} from '../common';
import initMoment from '../../tool/init-moment';

class PaperForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectAll: false,
      selectBox: []
    };
  }

  getSelectedIds() {
    return this.props.paperList.data.filter((item, key) => {
      return this.state.selectBox[key];
    }).map(item => item._id);
  }

  onSelectAll() {
    let selectAll = !this.state.selectAll;
    let selectBox = this.props.paperList.data.map(item => selectAll);
    this.setState({
      selectAll,
      selectBox
    }, () => {
      this.props.onIdChange(this.getSelectedIds());
    });
  }

  onCheckbox(index) {
    let selectBox = this.props.paperList.data.map((item, idx) => this.state.selectBox[idx]);
    selectBox[index] = !selectBox[index];
    let selectAll = selectBox.every((item) => item);
    this.setState({
      selectBox,
      selectAll
    }, () => {
      this.props.onIdChange(this.getSelectedIds());
    });
  }

  deletePaper(id) {
    this.props.onDeletePaper(id);
  }

  clearCheckbox() {
    this.setState({
      selectBox: [],
      selectAll: false
    });
  }

  handleChange(sort, order) {
    this.props.sortChange(sort, order);
  }

  render() {
    let fields = [
      {
        name: '名称',
        isNeedSort: true,
        sort: 'paperName'
      }, {
        name: '创建者',
        isNeedSort: true,
        sort: 'makerId'
      }, {
        name: '更新时间',
        isNeedSort: true,
        sort: 'updateTime'
      }, {
        name: '操作',
        isNeedSort: false,
        sort: 'operate'
      }, {
        name: '是否发布',
        isNeedSort: true,
        sort: 'isDistribution'
      }
    ];

    const paperList = this.props.paperList.data || [];
    let paperHTML = paperList.map(({isDistributed, paperName, makerName, updateTime, paperType, _id}, index) => {
      const distributionText = isDistributed ? '已发布' : '未发布';
      const time = initMoment(updateTime);
      const updatePath = isDistributed ? `/papers/${_id}/preview` : `/papers/${_id}/edit`;
      return (
        <tr key={index}>
          <th scope='row'>
            <input type='checkbox' checked={this.state.selectBox[index] || false}
                   onClick={this.onCheckbox.bind(this, index)}/>
          </th>
          <td> {paperName} </td>
          <td> {makerName} </td>
          <td> {time} </td>
          <td>
            <div className='action-buttons'>
              <Link className='green'
                    to={URI_PREFIX + updatePath}>
                <i className={'fa fa-pencil bigger pencil-green'}> </i>
              </Link>
              <Link className='red' onClick={this.deletePaper.bind(this, _id)}>
                <i className='fa fa-trash-o bigger'> </i>
              </Link>
            </div>
          </td>
          <td>
            <font className='distribution'> {distributionText}</font>
          </td>
        </tr>
      );
    });

    return (
      <div id='paperList-form'>

        <div className='table-form'>
          <table className='table table-striped table-bordered table-hover'>
            <thead>

            <SortField fields={fields} currentStateIndex={2} checked={this.state.selectAll || false}
                       onChange={this.onSelectAll.bind(this)}
                       sortChange={this.handleChange.bind(this)}/>

            </thead>
            <tbody>
            {paperHTML}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default PaperForm;
