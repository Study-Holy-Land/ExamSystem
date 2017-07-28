'use strict';

var GroupTitle = require('./component/style-guide/group-title.component.jsx');
var ListGroup = require('./component/style-guide/list-group.component.jsx');
var GroupEvent = require('./component/style-guide/group-event.component.jsx');
var DiscussFrame = require('./component/style-guide/discuss-frame.component.jsx');
var Arrows = require('./component/style-guide/arrows.component.jsx');
var AddPaper = require('./component/style-guide/add-paper.component.jsx');
var DiscussSubject = require('./component/style-guide/discuss-subject.component.jsx');
var DiscussList = require('./component/style-guide/discuss-list.component.jsx');
var Paper = require('./component/style-guide/paper.component.jsx');
var AddSection = require('./component/style-guide/add-section.component.jsx');
var Table = require('./component/style-guide/table.component.jsx');
var InviteLink = require('./component/style-guide/invite-link.component.jsx');
var PageMachine = require('./component/style-guide/page-machine.component.jsx');
var GroupAvatar = require('./component/style-guide/group-avatar.component.jsx');
var UploadAvatar = require('./component/style-guide/upload-avatar.component.jsx');
var LectureButton = require('./component/style-guide/lecture-button.component.jsx');
var CompleteSection = require('./component/style-guide/complete-section.component.jsx');
var LockSection = require('./component/style-guide/lock-section.component.jsx');
var AddGroup = require('./component/style-guide/add-group.component.jsx');
var TextBox = require('./component/style-guide/textbox.component.jsx');

require('../less/textbox.less');
require('../less/group-title.less');
require('../less/list-group.less');
require('../less/group-event-discuss-list.less');
require('../less/discuss-frame.less');
require('../less/add-paper.less');
require('../less/discuss-subject.less');
require('../less/paper.less');
require('../less/add-section.less');
require('../less/page-machine.less');
require('../less/group-title.less');
require('../less/group-avatar.less');
require('../less/upload-avatar.less');
require('../less/lecture-button.less');
require('../less/invite-link.less');
require('../less/complete-section.less');
require('../less/lock-section.less');

ReactDom.render(
  <div>
    <GroupTitle />
    <ListGroup />
    <GroupEvent />
    <DiscussFrame />
    <Arrows />
    <DiscussSubject />
    <DiscussList />
    <Paper item=""/>
    <AddPaper />
    <Table />
    <InviteLink />
    <PageMachine />
    <GroupAvatar />
    <AddGroup />
    <UploadAvatar />
    <LectureButton />
    <AddSection />
    <CompleteSection />
    <LockSection />
    <TextBox />
  </div>,
  document.getElementById('style-guide')
);
