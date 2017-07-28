import {Component} from 'react';
import {connect} from 'react-redux';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import errorHandler from '../../../../tools/error-handler.jsx';
import constant from '../../../../mixin/constant';
import moment from '../../../../tools/init-moment';

const sectionInfo = [
  {
    type: 'LogicPuzzle',
    title: '逻辑题',
    description: '请仔细阅读内容,并在规定时间段内答完题目'
  },
  {
    type: 'HomeworkQuiz',
    title: '编程题',
    description: ''
  },
  {
    type: 'BasicQuiz',
    title: '简单客观题',
    description: '请仔细阅读内容,并在规定时间段内答完题目\n02/05/2017--22/05/2017'
  }
];

class Summary extends Component {

  constructor (props) {
    super(props);
    this.state = {
      sectionLimit: ''
    };
  }

  componentWillReceiveProps (next) {
    if (next.section.type === 'HomeworkQuiz') {
      superagent.get(`${API_PREFIX}timer/initSection/${next.section._id}`)
        .set('Content-Type', 'application/json')
        .use(noCache)
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            throw err;
          } else {
            const startTime = parseInt(res.body.startTime) * constant.time.MILLISECOND_PER_SECONDS;
            const startDay = moment(startTime);
            const sevenDayTime = 20 * constant.time.HOURS_PER_DAY *
              constant.time.MINUTE_PER_HOUR *
              constant.time.SECONDS_PER_MINUTE *
              constant.time.MILLISECOND_PER_SECONDS;
            const endDay = moment(startTime + sevenDayTime);

            this.setState({sectionLimit: `${startDay}--${endDay}`});
          }
        });
    }
  }

  render () {
    const section = sectionInfo.find(({type}) => {
      if (this.props.section) {
        return type === this.props.section.type;
      } else {
        return {title: '', description: ''};
      }
    });
    return (
      <div>
        <div className='section-title'>{section.title}</div>
        <div className='section-description'>
          {section.description || this.state.sectionLimit}
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
