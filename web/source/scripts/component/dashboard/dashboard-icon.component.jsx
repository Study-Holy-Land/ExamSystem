/*eslint no-magic-numbers: 0*/

'use strict';

var Col = require('react-bootstrap/lib/Col');
var Reflux = require('reflux');
var DashboardStore = require('../../store/dashboard/dashboard-store');
var Arrow = require('./arrow.component.jsx');
var getQueryString = require('../../../../tools/getQueryString');
const sectionStatus = require("../../../../mixin/constant").sectionStatus;


var DashboardIcon = React.createClass({
  mixins: [Reflux.connect(DashboardStore)],

  getInitialState: function () {
    return {
      puzzleEnabled: true,
      homeworkEnabled: false,
      sections: []
    };
  },

  render() {

    const programType = this.state.programType || '';
    console.log('programtype',programType)
    var programId = getQueryString('programId');
    var paperId = getQueryString('paperId');
    var iconInfos = {
      LogicPuzzle: {
        title: '逻辑题',
        name: 'logic',
        glyphicon: 'glyphicon-education'
      },
      HomeworkQuiz: {
        title: '编程题',
        name: 'homework',
        glyphicon: 'glyphicon-road'
      },
      BasicQuiz: {
        title: '简单客观题',
        name: 'basic',
        glyphicon: 'glyphicon-pencil'
      }
    };

    var sectionType = {
      LogicPuzzle: (section) => {
        return `logic-puzzle.html?sectionId=${section.sectionId}&questionId=${section.firstQuizId}`;
      },
      HomeworkQuiz: (section) => {
        return `homework.html?sectionId=${section.sectionId}&questionId=${section.firstQuizId}`;
      },
      BasicQuiz: (section) => {
        return `basic-quiz.html?sectionId=${section.sectionId}`;
      }
    };

    var sectionList = this.state.sections.map((section, index) => {
      var arrow = (this.state.sections.indexOf(section) === this.state.sections.length - 1) ? (<div></div>) : (
          <Arrow/>);
      let preSection = this.state.sections[index - 1] || {status: 1};
      let preStatus = preSection.status;
      let status;
      if (section.status === sectionStatus.COMPLETEABDPASS) {
        status = true;
      } else {
        status = (section.status === sectionStatus.INCOMPLETE || section.status === sectionStatus.NOTSTART) &&
            (preStatus === sectionStatus.COMPLETE || preStatus === sectionStatus.TIMEOUT);
      }

      var disable = status === true ? 'enable' : 'disable';
      var uri = '';
      if (disable === 'disable') {
        uri = '#';
      } else {
        uri = sectionType[section.type](section);
      }
      console.log('section.status',section.status === sectionStatus.COMPLETE)

      if((section.status === sectionStatus.COMPLETE || section.status === sectionStatus.TIMEOUT) && programType === 'practice'){
        uri = sectionType[section.type](section);
      }



      return (
          <div key={index}>
            <a href={uri} className="icon-view">
              <div className={'icon-wrapper-' + disable}
                   name={iconInfos[section.type].name}>
                <div className="icon-img" name={iconInfos[section.type].name}>
                  <span className={'glyphicon ' + iconInfos[section.type].glyphicon} aria-hidden="true"/>
                </div>
                <div className="icon-name">
                  {iconInfos[section.type].title}
                </div>
              </div>
            </a>
            {arrow}
          </div>
      )
    });

    return (
        <div className="dashboard-icon">
          {sectionList}
        </div>
    );
  }
});

module.exports = DashboardIcon;