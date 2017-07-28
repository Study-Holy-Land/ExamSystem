'use strict';

require('../less/get-invitation-code.less');

var GetInvitationCode = require('./component/paper-list/GetInvitationCode.jsx');
ReactDom.render(
  <GetInvitationCode/>,
  document.getElementById('get-invitation-container')
);
