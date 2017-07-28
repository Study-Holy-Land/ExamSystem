import {Component} from 'react';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import HomeworkIntroduction from './homework-introduction';
import HomeworkSubmission from './homework-submission';
import homeworkQuizzesStatus from '../../../../mixin/constant';
import HomeworkRequestAnswer from './homework-request-answer';

class HomeworkQuiz extends Component {
  constructor (props) {
    super(props);
    this.state = {
      programType: this.props.programType
    };
  }

  componentWillReceiveProps (next) {
    this.setState({
      programType: next.programType
    });
  }

  render () {
    let tabHtml;
    if (this.state.programType) {
      let tabNames = [];
      const homeworkQuizDetailMap = [
        <HomeworkIntroduction key {...this.props.quizDetail} />,
        <HomeworkSubmission key {...this.props.quizDetail} />,
        <HomeworkRequestAnswer key {...this.props.quizDetail} />
      ];

      const isOpen = homeworkQuizzesStatus.LOCKED !== this.props.quizDetail.status;
      const isPractice = this.props.quizDetail && this.state.programType === 'practice';
      if (isPractice) {
        tabNames = isOpen ? ['题目说明', '提交作业', '查看答案'] : ['题目说明'];
      } else {
        tabNames = isOpen ? ['题目说明', '提交作业'] : ['题目说明'];
      }

      tabHtml = tabNames.map((item, index) => {
        return (
          <Tab key={index} eventKey={index} title={item}>
            <div>
              {homeworkQuizDetailMap[index]}
            </div>
          </Tab>);
      });
    }

    return (
      <div className='homework-detail'>
        <Tabs defaultActiveKey={0} animation={false} getShowStatus ref='tabs'>
          {tabHtml}
        </Tabs>
      </div>
    );
  }
}

export default HomeworkQuiz;
