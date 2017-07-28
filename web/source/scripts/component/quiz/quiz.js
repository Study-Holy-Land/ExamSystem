import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import superagent from 'superagent';
import errorHandler from '../../../../tools/error-handler.jsx';
import getQueryString from '../../../../tools/getQueryString';
import SectionInfo from './section-info';
import SectionList from './section-list';
import QuizDetail from './quiz-detail';
import page from 'page';

const quizId = getQueryString('quizId');

class Quiz extends Component {

  componentDidMount () {
    superagent.get(`${API_PREFIX}quiz/${quizId}/paperInfo`)
      .use(errorHandler)
      .end((err, res) => {
        if (res.statusCode === 404) {
          page('404.html');
        }
        if (err) {
          throw err;
        } else {
          this.props.initPaperInfo(res.body);
        }
      });
  }

  render () {
    return (
      <div id='quiz-page' className='row'>
        <div className='section-icon col-md-1 col-sm-2 col-xs-3'>
          <SectionList />
        </div>
        <div className='section-sidebar col-md-2 col-sm-3 col-xs-4'>
          <SectionInfo />
        </div>
        <div className='quiz-detail col-md-9 col-sm-7 col-xs-5'>
          <QuizDetail />
        </div>

      </div>
    );
  }
}

Quiz.propTypes = {
  initPaperInfo: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    initPaperInfo: (data) => {
      dispatch({type: 'INIT_PAPER_INFO', data});
    }
  };
};

export default connect(() => {
  return {};
}, mapDispatchToProps)(Quiz);
