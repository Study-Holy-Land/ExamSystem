import {Component} from 'react';
import superAgent from 'superagent';
import noCache from 'superagent-no-cache';
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');

export default class RequestAnswer extends Component {

  constructor (props) {
    super(props);
    this.state = {
      mentorList: [],
      answer: '',
      status: 0
    };
  }

  componentDidMount () {
    this.getMentors();
  }

  getMentors () {
    superAgent.get(API_PREFIX + 'mentors')
      .set('Content-Type', 'application/json')
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.setState({
            mentorList: res.body
          });
          this.getAnswer();
        }
      });
  }

  createMessage () {
    let url = window.location.href;
    const quizId = url.split('quizId=')[1];
    let data = {
      to: this.state.mentorList[0].id,
      type: 'REQUEST_ANSWER',
      deeplink: quizId
    };
    superAgent
      .post(API_PREFIX + 'messages')
      .use(errorHandler)
      .send(data)
      .end((err, res) => {
        if (err) {
          return;
        }
        this.setState({
          status: 1
        });
      });
  }

  getAnswer () {
    let url = window.location.href;
    const quizId = url.split('quizId=')[1];
    if (this.state.mentorList.length) {
      superAgent
        .get(API_PREFIX + 'messages/' + quizId)
        .query({
          from: this.state.mentorList[0].id,
          type: 'AGREE_REQUEST_ANSWER'
        })
        .use(noCache)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          if (res.body !== null) {
            superAgent
              .get(API_PREFIX + 'questions/getAnswer/' + quizId)
              .query({
                from: this.state.mentorList[0].id,
                type: 'AGREE_REQUEST_ANSWER'
              })
              .use(noCache)
              .end((err, res) => {
                if (err) {
                  throw (err);
                }
                if (res.statusCode === constant.httpCode.OK) {
                  this.setState({answer: res.body.answerPath});
                }
              });
          }
        });
    }
  }

  getMentorSpan () {
    return (<span className='mentor-span'>{this.state.mentorList.length ? 'mentor : ' + this.state.mentorList[0].userName : ''}</span>);
  }

  render () {
    const answerDownload = this.props.id ? '    点击下载答案' : '';
    const AddMentor = <a href='user-center.html#mentorManagement'>您当前没有mentor,请先添加mentor.</a>;
    const RequestAnswerBtn = (<button className='btn btn-primary'
        onClick={this.createMessage.bind(this)}
        disabled={this.state.status === 1}
                              >请求答案</button>);

    let info = this.state.mentorList.length ? '' : AddMentor;
    let result = info || (this.state.answer
        ? <a target='_blank' rel='noopener noreferrer' href={API_PREFIX + 'files/' + this.state.answer}>{answerDownload}</a> : RequestAnswerBtn);
    return (
      <div className='runningResult tab'>
        <div className='result'>
          {this.getMentorSpan()}
          {result}
        </div>
      </div>
    );
  }
};
