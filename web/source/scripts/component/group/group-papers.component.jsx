'use strict';

var GroupTitle = require("../style-guide/group-title.component.jsx");
var Paper = require("../style-guide/paper.component.jsx");

var GroupPapers = React.createClass({
  getInitialState: function () {
    return {
      noticedPapers: [
        {
          paperName: 'pos 无尽版',
          isMarked: true,
          isPublished: true,
          sectionNumber: 13,
          publishedNumber: 6,
          role: '2',
          isFinished: false
        },
        {
          paperName: 'pos 真·无尽版',
          isMarked: true,
          isPublished: true,
          sectionNumber: 13,
          publishedNumber: 6,
          role: '2',
          isFinished: false
        }
      ],
      unfinishedList: [
        {
          paperName: 'pos v_3.0',
          isMarked: false,
          isPublished: true,
          sectionNumber: 9,
          publishedNumber: 4,
          role: '2',
          isFinished: false
        },
        {
          paperName: 'pos v_2.0',
          isMarked: false,
          isPublished: true,
          sectionNumber: 10,
          publishedNumber: 5,
          role: '2',
          isFinished: false
        }
      ],
      finishedList: [
        {
          paperName: 'pos v_0.0',
          isMarked: false,
          isPublished: true,
          sectionNumber: 9,
          publishedNumber: 9,
          role: '2',
          isFinished: true
        },
        {
          paperName: 'pos v_1.0',
          isMarked: false,
          isPublished: true,
          sectionNumber: 10,
          publishedNumber: 10,
          role: '2',
          isFinished: true
        }
      ]
    }
  },

  render() {

    var noticedList = this.state.noticedPapers.map((item, index) => {
      return (<Paper item={item} key={index}/>)
    });
    var unfinishedList = this.state.unfinishedList.map((item, index) => {
      return (<Paper item={item} key={index}/>)
    });
    var finishedList = this.state.finishedList.map((item, index) => {
      return (<Paper item={item} key={index}/>)
    });

    return (
      <div className="col-md-12 col-sm-12 col-xs-12">
        <GroupTitle titleName="我关注的试卷"/>
        <div className="col-md-12 col-sm-12 col-xs-12">{noticedList}</div>
        <GroupTitle titleName="未完成的试卷"/>
        <div className="col-md-12 col-sm-12 col-xs-12">{unfinishedList}</div>
        <GroupTitle titleName="已完成的试卷"/>
        <div className="col-md-12 col-sm-12 col-xs-12">{finishedList}</div>
      </div>
    );
  }
});

module.exports = GroupPapers;