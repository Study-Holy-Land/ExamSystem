'use strict';
var UserCenterStore = require('../../store/user-center/user-center-store');
var StudentManagementStore = require('../../store/user-center/student-management-store');
var StudentManagementAction = require('../../actions/user-center/student-management-action');
var Reflux = require('reflux');
var StudentTableHeader = require('../student-management/table-header.component.jsx');
var StudentList = require('../student-management/students-list.component.jsx');
var StudentTableFooter = require('../student-management/table-footer.component.jsx');

const hashArray = window.location.hash.split('?');
const currentHash = hashArray[0].substr(1);

var StudentManagement = React.createClass({
  mixins: [Reflux.connect(UserCenterStore), Reflux.connect(StudentManagementStore)],

  getInitialState: function () {
    return {
      currentState: currentHash,
      studentList: []
    };
  },

  componentDidMount: function () {
    StudentManagementAction.getStudents();
  },

  getStudentsList: function (newList) {
    this.setState({studentList: newList});
  },

  render: function () {
    var classString = (this.state.currentState === 'studentManagement' ? '' : ' hide');
    return (
      <div className={"col-md-10 col-sm-10 col-xs-12 content-padding" + classString}>
        <div className="content">
          <StudentTableHeader/>
          <StudentList studentList={this.state.studentList}/>
          <StudentTableFooter totalPage={this.state.studentList.totalPage}
                              onGetStudentsList={this.getStudentsList}/>
        </div>
      </div>
    );
  }
});

module.exports = StudentManagement;