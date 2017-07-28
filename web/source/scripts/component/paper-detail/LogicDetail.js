import {Component} from 'react';
import {connect} from 'react-redux';
import superAgent from 'superagent';
import noCache from 'superagent-no-cache';
import '../../libs/jquery.elevatezoom';
import 'lightbox2/dist/css/lightbox.min.css';
import 'lightbox2/dist/js/lightbox.min.js';
import $ from 'jquery';

class LogicDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quizId: '',
      isExample: '',
      itemCount: '',
      item: {
        chartPath: '',
        question: '',
        description: [],
        initializedBox: []
      },
      userAnswer: ''
    };
  }

  componentDidMount () {

  }

  componentWillReceiveProps (next) {
    this.setState({itemCount: next.questions.length});
    if (next.questionId.id) {
      this.setState({quizId: next.questionId.id});
      superAgent.get(`${API_PREFIX}questions/${next.questionId.id}`)
        .use(noCache)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          this.setState({
            item: res.body.item,
            isExample: res.body.isExample,
            userAnswer: res.body.userAnswer
          });
        });
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const orderChange = (prevProps.orderId !== this.props.orderId);
    if (orderChange && (prevProps.orderId === undefined && prevProps.questionId.id)) {
      this.submitAnswer(prevProps.questionId.id, prevState.userAnswer);
    } else if (orderChange && prevProps.orderId !== undefined) {
      this.submitAnswer(prevProps.questionId.id, prevState.userAnswer);
    }

    if (this.state.item.chartPath !== '') {
      $('.zoomContainer').remove();
      $(this.refs.logicPuzzleImg)
        .removeData('zoomImage')
        .elevateZoom({
          zoomWindowFadeIn: 500,
          zoomWindowFadeOut: 500,
          lensFadeIn: 500,
          lensFadeOut: 500
        });
    }
  }

  handleClick (event) {
    event.preventDefault();
    let orderId;
    if (this.props.orderId) {
      orderId = this.props.orderId;
    } else {
      orderId = 1;
    }
    const questions = this.props.questions;
    this.submitAnswer(this.state.quizId, this.state.userAnswer);
    this.props.editPaper({activeQuestion: questions[orderId], orderId: orderId + 1});
  }

  submitAnswer (quizId, userAnswer) {
    superAgent.post(`${API_PREFIX}puzzle/quiz/${quizId}/submit`)
      .send({userAnswer})
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        return;
      });
  }

  handleAnswerChange (event) {
    this.setState({userAnswer: event.target.value});
  }

  render () {
    let logicHeaderClass = this.state.isExample ? '' : 'header-hidden';
    return (
      <div>
        <div className='quiz-detail-left col-sm-5'>
          <div className='box'>
            <div className='box-span'>
              <div>BoxNo.</div>
              <div>BoxNumber.</div>
            </div>
            <div className='box-number'>
              <ol>
                {this.state.item.initializedBox.filter((val, key) => {
                  return key > 0;
                }).map((box, idx) => {
                  return (
                    <li key={idx}>
                      {idx + 1}
                    </li>
                  );
                })}
              </ol>
              <ol>
                {this.state.item.initializedBox.filter((val, key) => {
                  return key > 0;
                }).map((box, idx) => {
                  return (
                    <li key={idx}>
                      {box}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          <div className='chart'>
            <a className='chart-image' href={this.state.item.chartPath} data-lightbox='image'>
              <img src={this.state.item.chartPath} alt='逻辑题图片' data-zoom-image={this.state.item.chartPath} ref='logicPuzzleImg' />
              <i className='fa fa-search-plus magnifying-glass' />
            </a>
          </div>
        </div>
        <div className='quiz-detail-right col-sm-7'>
          <h4 className={'logic-header ' + logicHeaderClass}>示例题</h4>
          <div className='logic-desc'>
            <ol>
              {this.state.item.description.filter((val) => {
                return val !== '';
              }).map((description, idx) => {
                return (<li key={idx}>
                  {description}
                </li>);
              })}
            </ol>
            <span className='question'>{this.state.item.question}</span>
          </div>
          <form className='form-inline'>
            <input type='text' className='form-control answer-input' placeholder='请输入答案' value={this.state.userAnswer} disabled={this.state.isExample ? 'disabled' : ''} onChange={(e) => this.handleAnswerChange(e)} />
            <button className='btn btn-default answer-submit' onClick={(e) => this.handleClick(e)} disabled={this.props.orderId === this.state.itemCount ? 'disabled' : ''}>进入下一题</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({paperDetail}) => {
  return {
    questionId: paperDetail.activeQuestion,
    questions: paperDetail.questions,
    orderId: paperDetail.orderId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogicDetail);
