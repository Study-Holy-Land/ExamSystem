import {Component} from 'react';
import '../../style/paper-edit.less';
import Section from './Section';
import BasicQuizSection from './Basic-quiz-section';

const sectionType = {
  'homeworkQuiz': Section,
  'basicQuiz': BasicQuizSection
};

class SectionList extends Component {

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
  }

  moveCard(dragIndex, hoverIndex) {
    this.props.sortSections(dragIndex, hoverIndex);
    this.props.editPaper({hasUnsavedChanges: true});
  }

  render() {
    const sections = this.props.sections || [];
    let sectionList = sections.map((section, index) => {
      let Section = sectionType[section.type];
      return (<div key={index}>
        <Section index={index} {...section}
                 updateState={this.props.updateState}
                 replaceBasicQuiz={this.props.replaceBasicQuiz}
                 id={section._id}
                 moveCard={this.moveCard}
                 isDistributed={this.props.isDistributed}
        />
      </div>);
    });
    return (
      <div id='paper-section'>
        <div className='split-border'></div>
        {sectionList}
      </div>
    );
  }
}

export default SectionList;
