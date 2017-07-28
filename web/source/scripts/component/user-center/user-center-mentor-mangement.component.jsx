'use strict';
var UserCenterStore = require('../../store/user-center/user-center-store');
var MentorManagementStore = require('../../store/user-center/mentor-management-store');
var MentorManagementAction = require('../../actions/user-center/mentor-management-action');
var Reflux = require('reflux');
var MentorTable = require('./user-center-mentor-table.component.jsx');
var MentorSearch = require('./user-center-mentor-search.component.jsx');

const hashArray = window.location.hash.split('?');
const currentHash = hashArray[0].substr(1);

var MentorManagement = React.createClass({
  mixins: [Reflux.connect(UserCenterStore), Reflux.connect(MentorManagementStore)],

  getInitialState: function () {
    return {
      currentState: currentHash,
      mentorList: []
    };
  },

  componentDidMount: function () {
    MentorManagementAction.getMentors();

  },

  render: function () {
    var classString = (this.state.currentState === 'mentorManagement' ? '' : ' hide');

    return (
      <div className={"col-md-10 col-sm-10 col-xs-12 content-padding" + classString}>
        <div className="content">
          <MentorSearch mentorList={this.state.mentorList}/>
          <MentorTable mentorList={this.state.mentorList}/>
        </div>
      </div>
    );
  }
});

module.exports = MentorManagement;