import {Component} from 'react';
import {connect} from 'react-redux';
import superAgent from 'superagent';
import noCache from 'superagent-no-cache';
var Tabs = require('react-bootstrap/lib/Tabs');
var Tab = require('react-bootstrap/lib/Tab');
import HomeworkIntroduction from './HomeworkDetailIntroduction';

const homeworkDetailMap = [
  <HomeworkIntroduction key />,
  <HomeworkIntroduction key />,
  <HomeworkIntroduction key />,
  <HomeworkIntroduction key />
];

class HomeworkDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      homeworkDetail: {}
    };
  }

  componentDidMount () {
    if (this.props.question) {
      superAgent.get(`${API_PREFIX}questions/${this.props.question.id}`)
          .use(noCache)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            this.props.editPaper({homeworkDetail: res.body});
          });
    }
  }

  componentWillReceiveProps (next) {
    superAgent.get(`${API_PREFIX}questions/${next.question.id}`)
        .use(noCache)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          this.props.editPaper({homeworkDetail: res.body});
        });
  }

  render () {
    let isOpen = true;
    const tabNames = isOpen ? ['题目说明', '提交作业', '运行结果', '查看答案'] : ['题目说明'];

    const tabHtml = tabNames.map((item, idx) => {
      return (<Tab key={idx} eventKey={idx} title={item}>
        <div>
          {homeworkDetailMap[idx]}
        </div>
      </Tab>);
    });
    return (
        <div className='homework-detail'>
          <Tabs defaultActiveKey={0} animation={false} getShowStatus ref='tabs'>
            {tabHtml}
          </Tabs>
        </div>
    );
  }
}

const mapStateToProps = ({paperDetail}) => {
  return {
    question: paperDetail.activeQuestion
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkDetail);
