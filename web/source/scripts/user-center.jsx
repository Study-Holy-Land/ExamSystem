'use strict';

require('../less/user-center.less');
require('../less/get-account.less');
require('../less/student-management.less');
require('../less/toastr.less');
require('../less/animate.less');

var UserCenterApp = require('./component/user-center/user-center-app.component.jsx');
var Navigation = require('./component/navigation/navigation.component.jsx');
var UserDetail = require('./component/user-center/user-center-detail.component.jsx');
var ChangePassword = require('./component/user-center/change-password.component.jsx');
var UserCenterSidebar = require('./component/user-center/user-center-sidebar.component.jsx');
var UserCenterGender = require('./component/user-center/user-center-gender.component.jsx');
var NewPassword = require('./component/reuse/new-password.component.jsx');
var FeedbackResult = require('./component/user-center/feedback-result.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');
var Message = require('./component/user-center/user-center-message.component.jsx');
var MentorManagement = require('./component/user-center/user-center-mentor-mangement.component.jsx');
var StudentManagement = require('./component/user-center/user-center-student-management.component.jsx');

ReactDom.render(
  <div>
    <header>
      <Navigation>
        <Account />
      </Navigation>
    </header>
    <UserCenterApp>
      <UserCenterSidebar/>
      <UserDetail>
        <UserCenterGender/>
      </UserDetail>
      <ChangePassword>
        <NewPassword initialStatus="userDetail"/>
      </ChangePassword>
      <Message/>
      <MentorManagement/>
      <StudentManagement/>
    </UserCenterApp>
  </div>,
  document.getElementById('user-center')
);
