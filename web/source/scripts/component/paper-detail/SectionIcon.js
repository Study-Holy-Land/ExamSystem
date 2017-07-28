import {Component} from 'react';
import {connect} from 'react-redux';

const iconInfos = [
  {
    title: '逻辑题',
    name: 'logic',
    icon: 'code-fork',
    type: 'LogicPuzzle'
  }, {
    title: '编程题',
    name: 'homework',
    icon: 'coffee',
    type: 'HomeworkQuiz'
  }, {
    title: '简单客观题',
    name: 'basic',
    icon: 'circle-o',
    type: 'BasicQuiz'
  }
];

class SectionIcon extends Component {

  constructor (props) {
    super(props);
    this.state = {
      sections: []
    };
  }

  componentWillReceiveProps (next) {
    this.setState({sections: next.sections});
  }

  getDisable (section, preStatus) {
    let status = (section.status === 0 || section.status === 3) && (preStatus === 1 || preStatus === 2);
    return status === true ? 'section-enable' : 'section-disable';
  }

  render () {
    const sectionIcons = this.state.sections.map((section, index) => {
      let preSection = this.state.sections[index - 1] || {status: 1};
      let preStatus = preSection.status;
      const disable = this.getDisable(section, preStatus);

      if (disable === 'section-enable') {
        this.props.editPaper({activeSection: section});
      }

      const currentIcon = iconInfos.find(iconInfo => iconInfo.type === section.type);
      return (<div key={index} className={`section-model text-center ${disable}`}>
        <i className={`fa fa-${currentIcon.icon}`} />
        <p>{currentIcon.title}</p>
      </div>);
    });
    return (
        <div className='section-icon col-md-1'>
          {sectionIcons}
        </div>
    );
  }
}

const mapStateToProps = ({paperDetail}) => {
  return {
    sections: paperDetail.sections
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionIcon);
