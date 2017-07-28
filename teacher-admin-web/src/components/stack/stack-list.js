import {Component} from 'react';
const stackStatus = {
  0: '正在构建',
  1: '构建成功',
  2: '构建失败'
};

const statusIcon = {
  0: <i className='fa fa-clock-o building' aria-hidden='true'></i>,
  1: <i className='fa fa-check success' aria-hidden='true'></i>,
  2: <i className='fa fa-times fail' aria-hidden='true'></i>
};

export default class StackList extends Component {

  render() {
    const stacks = this.props.stacks || [];
    return (
      <div className='stack-table'>
        <table className='table table-bordered table-striped table-hover'>
          <thead>
          <tr>
            <th>名称</th>
            <th>描述</th>
            <th>Image</th>
            <th>构建状态</th>
          </tr>
          </thead>
          <tbody className='table-body'>
          {
            stacks.map(({title, description, definition, status}, index) => {
              return (
                <tr key={index}>
                  <th>{title}</th>
                  <th>{description}</th>
                  <th>{definition}</th>
                  <th>{stackStatus[status]} {statusIcon[status]}</th>
                </tr>
              );
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
}
