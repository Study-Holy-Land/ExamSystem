'use strict';

var GroupTitle = require('../style-guide/group-title.component.jsx');
var GroupAvatar = require('../style-guide/group-avatar.component.jsx');
var Paper = require('../style-guide/paper.component.jsx');

var GroupHomepage = React.createClass({
  getInitialState(){
    return {
      groups: [
        {
          groupName: 'js学习',
          groupAvatar: require('../../../images/1.pic_hd.jpg')
        }, {
          groupName: 'java学习',
          groupAvatar: require('../../../images/1.pic_hd.jpg')
        },
        {
          groupName: 'java学习',
          groupAvatar: require('../../../images/1.pic_hd.jpg')
        }
      ],
      papers: [
        {
          paperName: 'pos 无尽版',
          isMarked: true,
          isPublished: true,
          sectionNumber: 13,
          publishedNumber: 6,
          role: '2',
          isFinished: true
        },
        {
          paperName: 'pos 真·无尽版',
          isMarked: false,
          isPublished: false,
          sectionNumber: 10,
          publishedNumber: 1,
          role: '1',
          isFinished: false
        }
      ]
    }
  },
  render(){
    var groupList = this.state.groups.map((group, index) => {
      return (
        <div className="col-md-3 col-sm-4 col-xs-6" key={index}>
          <GroupAvatar groupName={group.groupName} groupAvatar={group.groupAvatar}/>
        </div>
      )
    });

    var paperList = this.state.papers.map((paper, index) => {
      return (
        <div className="col-md-3 col-sm-6 col-xs-12" key={index}>
          <Paper item={paper}/>
        </div>
      )
    });
    return (
      <div>
        <GroupTitle titleName="我的群组"/>
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="col-md-3  col-sm-4 col-xs-6">
            <GroupAvatar groupName="思特沃克特训营" groupAvatar={require('../../../images/1.pic_hd.jpg')}/>
          </div>
          {groupList}
        </div>

        <GroupTitle titleName="我关注的试卷"/>
        {paperList}
      </div>
    )
  }
});

module.exports = GroupHomepage;