'use strict';

var GroupTitle = require('../style-guide/group-title.component.jsx');

var GroupMember = React.createClass({

  render() {
    return (
      <GroupTitle titleName="群组成员"/>
    );
  }
});

module.exports = GroupMember;