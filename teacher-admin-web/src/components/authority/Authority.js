import {Component} from 'react';
import '../../style/authotrity.less';
import {PaginationWrapper, ButtonWrapper} from '../common';

export default class UserCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operationButton: false,
      authorityArray: [],
      data: []
    };
  }

  handleClick(id, isAuthority, authorityType, index) {
    let newDta = this.state.data;
    if (authorityType === 'paper') {
      newDta[index].paper = !isAuthority;
      this.state.authorityArray.push({_id: id, paper: !isAuthority});
    }
    if (authorityType === 'homework') {
      newDta[index].homework = !isAuthority;
      this.state.authorityArray.push({_id: id, homework: !isAuthority});
    }
    if (authorityType === 'grade') {
      newDta[index].grade = !isAuthority;
      this.state.authorityArray.push({_id: id, grade: !isAuthority});
    }
    this.setState({
      data: newDta,
      operationButton: true
    });
  }

  changeAuthority() {
    let newAuthorityArray = [];
    this.state.authorityArray.forEach((item) => {
      const element = newAuthorityArray.find((element) => {
        return item._id === element._id && Object.keys(element)[1] === Object.keys(item)[1];
      });
      if (element) {
        newAuthorityArray[newAuthorityArray.indexOf(element)] = item;
      } else {
        newAuthorityArray.push(item);
      }
    });
  }

  componentDidMount() {
    const nameList = [
      {_id: '1', name: 'aaa', paper: true, homework: true, grade: false},
      {_id: '2', name: 'bbbb', paper: true, homework: false, grade: true},
      {_id: '3', name: 'ccc', paper: true, homework: false, grade: false},
      {_id: '4', name: 'dddd', paper: false, homework: false, grade: true}
    ];
    this.setState({data: nameList});
  }

  render() {
    const nameList = this.state.data || [];
    const tableHTML = nameList.map((item, index) => {
      return (
        <tr key={index}>
          <td>{item.name}</td>
          <td><input type='checkbox' checked={item.paper}
                     onChange={this.handleClick.bind(this, item._id, item.paper, 'paper', index)}/></td>
          <td><input type='checkbox' checked={item.homework}
                     onChange={this.handleClick.bind(this, item._id, item.homework, 'homework', index)}/>
          </td>
          <td><input type='checkbox' checked={item.grade}
                     onChange={this.handleClick.bind(this, item._id, item.grade, 'grade', index)}/></td>
        </tr>
      );
    });
    return (
      <div id='authority'>
        <div className='title'>权限管理</div>

        <div className='authorityTable-title'>
          <ButtonWrapper element='fa-check bigger blue' text='确定' operationButton={this.state.operationButton}
                         changeAuthority={this.changeAuthority.bind(this)}/>
          <ButtonWrapper element='fa-circle-o-notch bigger blue' text='重置' operationButton={true}/>
        </div>

        <div id='table'>
          <table className='table table-striped table-hover table-bordered'>
            <thead>
            <tr>
              <th>用户名</th>
              <th>试卷管理</th>
              <th>试题管理</th>
              <th>成绩管理</th>
            </tr>
            </thead>
            <tbody>
            {tableHTML}
            </tbody>
          </table>
        </div>

        <div className='form-footer row'>
          <div className='col-xs-6 dataTable-pagination'>
            <PaginationWrapper totalPage={2} currentPage={1}/>
          </div>
        </div>
      </div>

    );
  }
}
