import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import superAgent from 'superagent';
import noCache from 'superagent-no-cache';
import '../../libs/jquery.elevatezoom';
import 'lightbox2/dist/css/lightbox.min.css';
import 'lightbox2/dist/js/lightbox.min.js';
import getQueryString from '../../../../tools/getQueryString';
import $ from 'jquery';
import page from 'page';

const quizId = getQueryString('quizId');

class LogicPuzzle extends Component {

  constructor (props) {
    super(props);
    this.state = {
      userAnswer: '',
      finalQuizId: '',
      section: {}
    };
  }

  componentDidMount () {
    superAgent.get(`${API_PREFIX}quiz/${quizId}`)
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({
          userAnswer: res.body.userAnswer
        }, () => {
          this.answerValue.value = this.state.userAnswer;
          this.props.onGetAnswer(this.answerValue.value, quizId);
        });
      });
  }

  componentDidUpdate () {
    if (this.props.quizDetail.item.chartPath !== '') {
      $('.zoomContainer').remove();
      $(this.refs.logicPuzzleImg)
        .removeData('zoomImage')
        .elevateZoom({
          zoomWindowFadeIn: 500,
          zoomWindowFadeOut: 500,
          lensFadeIn: 500,
          lensFadeOut: 500,
          zoomWindowOffetx: -500,
          responsive: true
        });
    }
  }

  isExistCurrentQuiz (section) {
    if (section.quizzes) {
      return section.quizzes.find((quizz) => {
        return quizz._id === quizId;
      });
    }
    return false;
  }

  handleClick (event) {
    event.preventDefault();
    superAgent
      .post(`${API_PREFIX}quiz/${quizId}/submission`)
      .send({userAnswer: this.state.userAnswer})
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          const section = this.props.section;
          let currentQuiz = this.isExistCurrentQuiz(section);
          if (currentQuiz) {
            const quizzes = section.quizzes;
            let index = quizzes.indexOf(currentQuiz);
            const nextQuizId = quizzes[index + 1]._id;
            page('quiz.html?quizId=' + nextQuizId);
          }
        }
      });
  }

  handleAnswerChange (event) {
    this.setState({userAnswer: this.answerValue.value.trim()}, () => {
      this.props.onGetAnswer(this.state.userAnswer, quizId);
    });
  }

  render () {
    const quizDetail = this.props.quizDetail;
    let logicHeaderClass = quizDetail.isExample ? '' : 'hidden';

    let finalQuizId;
    const section = this.props.section;
    let currentQuiz = this.isExistCurrentQuiz(section);
    if (currentQuiz) {
      const quizzes = section.quizzes;
      finalQuizId = quizzes[quizzes.length - 1]._id;
    }

    return (
      <div className='flex-container'>
        <div className='flex'>
          <div className='quiz-detail-left col-md-7 col-sm-7 col-xs-6'>
            <h4 className={'logic-header ' + logicHeaderClass}>示例题</h4>
            <div className='logic-desc'>
              <ol>
                {quizDetail.item.description.filter((val) => {
                  return val !== '';
                }).map((description, idx) => {
                  return (<li key={idx}>
                    {description}
                  </li>);
                })}
              </ol>
              <span className='question'>{quizDetail.item.question}</span>
            </div>
            <form className='form-inline'>
              <input type='number' className='form-control answer-input'
                  placeholder='请输入答案'
                  ref={(ref) => {
                    this.answerValue = ref;
                  }}
                  onChange={(e) => this.handleAnswerChange(e)}
                  disabled={quizDetail.isExample ? 'disabled' : ''}
              />
              <button className='btn btn-default answer-submit'
                  onClick={(e) => this.handleClick(e)}
                  disabled={finalQuizId === quizId ? 'disabled' : ''}

              >进入下一题
              </button>
            </form>
          </div>

          <div className='quiz-detail-right col-md-5 col-sm-5 col-xs-6'>
            <div className='box'>
              <div className='box-span'>
                <div>BoxNo.</div>
                <div>BoxNumber.</div>
              </div>
              <div className='box-number'>
                <ol>
                  {quizDetail.item.initializedBox.filter((val, key) => {
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
                  {quizDetail.item.initializedBox.filter((val, key) => {
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
            <div className='chart text-center'>
              <a className='chart-image' href={quizDetail.item.chartPath} data-lightbox='image'>
                <img src={quizDetail.item.chartPath} alt='逻辑题图片' data-zoom-image={quizDetail.item.chartPath}
                    ref='logicPuzzleImg'
                />
                <i className='fa fa-search-plus magnifying-glass' />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

LogicPuzzle.propTypes = {
  onGetAnswer: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAnswer: (userAnswer, quizId) => {
      let data = {userAnswer, quizId};
      dispatch({type: 'GET_ANSWER', data});
    }
  };
};

export default connect(() => {
  return {};
}, mapDispatchToProps)(LogicPuzzle);

