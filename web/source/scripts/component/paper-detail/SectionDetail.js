import {Component} from 'react';
import {connect} from 'react-redux';
import superAgent from 'superagent';
import noCache from 'superagent-no-cache';
import LogicSidebar from './LogicSidebar';
import HomeworkSidebar from './HomeworkSidebar';
import LogicDetail from './LogicDetail';
import HomeworkDetail from './HomeworkDetail';
import getQueryString from '../../../../tools/getQueryString';

const programId = getQueryString('programId');
const paperId = getQueryString('paperId');

const currentSection = {
  'LogicPuzzle': {
    'sidebar': <LogicSidebar />,
    'detail': <LogicDetail />
  },
  'HomeworkQuiz': {
    'sidebar': <HomeworkSidebar />,
    'detail': <HomeworkDetail />
  },
  'BasicQuiz': {
    'sidebar': <LogicSidebar />
  }
};

class SectionSidebar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      section: ''
    };
  }

  componentDidMount () {
  }

  componentWillReceiveProps (next) {
    this.setState({section: next.section});
    if (next.section) {
      const sectionId = next.section.sectionId;
      const uri = `${API_PREFIX}programs/${programId}/papers/${paperId}/sections/${sectionId}/questionIds`;
      superAgent.get(uri)
        .use(noCache)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          this.props.editPaper({questions: res.body});
        });
    }
  }

  render () {
    const currentSidebar = this.state.section ? currentSection[this.state.section.type].sidebar : '';
    const currentDetail = this.state.section ? currentSection[this.state.section.type].detail : '';

    return (
      <div className='section-detail'>
        <div className='section-sidebar col-md-3'>
          {currentSidebar}
        </div>
        <div className='quiz-detail row'>
          {currentDetail}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({paperDetail}) => {
  return {
    section: paperDetail.activeSection
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionSidebar);

