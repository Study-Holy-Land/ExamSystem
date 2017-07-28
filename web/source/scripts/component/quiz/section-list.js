import {Component, PropTypes} from 'react';
import page from 'page';
import {connect} from 'react-redux';
import getQueryString from '../../../../tools/getQueryString';

const iconInfos = [
  {
    name: 'logic',
    icon: 'code-fork',
    type: 'LogicPuzzle'
  }, {
    name: 'homework',
    icon: 'coffee',
    type: 'HomeworkQuiz'
  }, {
    name: 'basic',
    icon: 'circle-o',
    type: 'BasicQuiz'
  }
];

class SectionList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      sections: []
    };
  }

  componentWillReceiveProps (next) {
    const quizId = getQueryString('quizId');
    this.props.getDisable({sections: next.paperInfo.sections, quizId: quizId});
    this.setState({
      sections: next.paperInfo.sections
    });
  }

  handleClick (index) {
    const currentSection = this.state.sections[index];
    if (this.props.paperInfo.program.type === 'practice' && (currentSection.status === 1 || currentSection.status === 0)) {
      page(`quiz.html?&quizId=${currentSection.quizzes[0]._id}`);
    }
  }

  render () {
    let sectionIcons = this.state.sections.map((section, index) => {
      const disable = section.isDisable ? 'section-enable' : 'section-disable';
      const currentIcon = iconInfos.find(iconInfo => iconInfo.type === section.type);

      return (<div key={index}
          className={`section-model text-center ${disable}`}
          onClick={this.handleClick.bind(this, index)}
              >
        <i className={`fa fa-${currentIcon.icon}`} />
        <p>{section.sectionName}</p>
      </div>);
    });

    return (
      <div>
        {sectionIcons}
      </div>
    );
  }
}

SectionList.propTypes = {
  paperInfo: PropTypes.object.isRequired
};

const mapStateToProps = ({quiz}) => {
  return {
    paperInfo: quiz.paperInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDisable: (data) => {
      dispatch({type: 'GET_DISABLE', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionList);
