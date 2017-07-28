'use strict';

var GroupTitle = require("../style-guide/group-title.component.jsx");
var GroupEvent = require("../style-guide/group-event.component.jsx");
var GroupAvatar = require("../style-guide/group-avatar.component.jsx");
var TextBox = require("../style-guide/textbox.component.jsx");

var GroupIndex = React.createClass({

  getInitialState: function () {
    return {
      announcement: '公告',
      paperNumber: 8,
      memberNumber: 35
    }
  },

  render() {
    return (
      <div>
        <div className="col-md-9">
          <GroupTitle titleName="群组公告"/>
          <TextBox content={this.state.announcement} readonly={true}/>
          <GroupTitle titleName="群组事件"/>
          <GroupEvent />
        </div>
        <div className="col-md-3 group-icon">
          <GroupAvatar groupName="前端学习群" groupAvatar={require('../../../images/1.pic_hd.jpg')}/>
          <p>试卷:{this.state.paperNumber}张</p>
          <p>人数:{this.state.memberNumber}人</p>
        </div>
      </div>
    );
  }

});

module.exports = GroupIndex;