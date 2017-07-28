import {Component} from 'react';

export default class StudentList extends Component {

  render() {
    let students = this.props.studentList.students || [];
    const studentHtml = students.map(({id, name, school, email, homeworkSubmitCount, hasRequestAnswer}, index) => {
      let href = hasRequestAnswer ? 'http://show-case.thoughtworks.school:8888/api/reports/4/' + id : '';
      let notActive = hasRequestAnswer ? '' : 'not-active';
      return (
        <tr key={index}>
          <td>{name}</td>
          <td>{school}</td>
          <td>{email}</td>
          <td>{homeworkSubmitCount}</td>
          <td><a className={notActive} href={href}><i
            className='fa fa-share'></i></a></td>
        </tr>
      );
    });

    return (
      <div id='studentList-form'>
        <div className='table-form'>
          <table className='table table-striped table-bordered table-hover'>
            <thead>
            <tr>
              <th>学生姓名</th>
              <th>学校</th>
              <th>邮箱</th>
              <th>已答编程题数</th>
              <th>请求答案的答题详情</th>
            </tr>
            </thead>
            <tbody>
            {studentHtml}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
