import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Modal, Button} from 'react-bootstrap';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import errorHandler from '../../../../tools/error-handler.jsx';
import page from 'page';
import async from 'async';
import getQueryString from '../../../../tools/getQueryString';
import constant from '../../../../mixin/constant';
const quizId = getQueryString('quizId');

class SubmitButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      sectionId: '',
      showModal: false,
      sections: [],
      showFinishModel: false,
      showTimeOverModal: false,
      ableToSubmit: true,
      showButton: ''
    };
  }

  componentWillReceiveProps (next) {
    if (next.section.type === 'LogicPuzzle') {
      this.handleLogicPuzzle(next);
    }

    if (next.section.status === 1 && next.paperInfo.program && next.paperInfo.program.type === 'practice') {
      this.setState({
        ableToSubmit: false
      });
    }

    if (next.section.type === 'HomeworkQuiz') {
      this.setState({showButton: 'hidden'});
    } else if (next.section.type === 'BasicQuiz') {
      this.handleBasicQuiz(next);
    }

    this.setState({
      sectionId: next.section._id,
      sections: next.paperInfo.sections,
      showTimeOverModal: next.showTimeOverModal
    });
  }

  handleLogicPuzzle (next) {
    next.section.quizzes.forEach(({submits, _id}, index) => {
      if ((!submits.length && index !== next.section.quizzes.length - 1) || (!submits.length && quizId !== _id)) {
        this.setState({
          ableToSubmit: false
        });
      }
    });
  }

  handleBasicQuiz (next) {
    if (!next.basicQuiz.length) {
      this.setState({ableToSubmit: false, basicQuiz: next.basicQuiz});
    } else {
      this.setState({ableToSubmit: true, basicQuiz: next.basicQuiz});
    }
  }

  handleShowModal () {
    this.setState({showModal: true});
  }

  showFinishMessage () {
    this.setState({showTimeOverModal: false, showFinishModel: true});
  }

  handleReturnClick () {
    page('paper-list.html');
  }

  submitSection (sectionId, sections, finishSection) {
    superagent.post(`${API_PREFIX}quiz/section/${sectionId}/submission`)
      .set('Content_Type', 'application/json')
      .use(errorHandler)
      .query({type: finishSection.type})
      .send(this.state.basicQuiz)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        if (res.statusCode === constant.httpCode.CREATED) {
          const finishSectionIndex = sections.indexOf(finishSection);
          if (finishSectionIndex === sections.length - 1) {
            this.showFinishMessage();
          } else {
            const currentQuizId = sections[finishSectionIndex + 1].quizzes[0]._id;
            page(`quiz.html?&quizId=${currentQuizId}`);
          }
        }
      });
  }

  submitLogicPuzzle (quizId, userAnswer, cb) {
    superagent.post(`${API_PREFIX}quiz/${quizId}/submission`)
      .send({userAnswer})
      .use(noCache)
      .query({type: 'LogicPuzzle'})
      .end(cb);
  }

  handleClick () {
    const sectionId = this.state.sectionId;
    const sections = this.state.sections;
    const finishSection = sections.find(section => section._id === sectionId);
    const unSubmitQuizzes = finishSection.quizzes.filter(quiz => quiz.submits.length === 0);
    if (finishSection.type === 'LogicPuzzle' && unSubmitQuizzes) {
      async.mapSeries(unSubmitQuizzes, (quiz, cb) => {
        let userAnswer = '';
        if (quiz._id === quizId) {
          userAnswer = this.props.userAnswer || '';
        }
        this.submitLogicPuzzle(quiz._id, userAnswer, cb);
      }, (err, res) => {
        if (err) {
          throw err;
        }

        this.submitSection(sectionId, sections, finishSection);
      });
    } else {
      this.submitSection(sectionId, sections, finishSection);
    }
  }

  cancelButton () {
    this.setState({
      showModal: false
    });
  }

  render () {
    return (
      <div className={this.state.showButton}>
        <button disabled={this.state.ableToSubmit ? '' : 'disabled'}
            className='btn btn-default logic-submit'
            onClick={(e) => this.handleShowModal(e)}
        >
          提交章节
        </button>

        <div className={this.state.showModal ? '' : 'hidden'}>
          <div className='static-modal'>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>注意！</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                提交后，答案不可更改，是否确定?
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={(e) => this.cancelButton(e)}>取消</Button>
                <Button bsStyle='primary' onClick={(e) => this.handleClick(e)}>确定</Button>
              </Modal.Footer>

            </Modal.Dialog>
          </div>
        </div>

        <div className={this.state.showFinishModel ? '' : 'hidden'}>
          <div className='static-modal'>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>您已完成该试卷</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                点击确定，回到试卷列表
              </Modal.Body>

              <Modal.Footer>
                <Button bsStyle='primary' onClick={(e) => this.handleReturnClick(e)}>确定</Button>
              </Modal.Footer>

            </Modal.Dialog>
          </div>
        </div>

        <div className={this.state.showTimeOverModal ? '' : 'hidden'}>
          <div className='static-modal'>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>提示</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                时间到，提交试卷.
              </Modal.Body>

              <Modal.Footer>
                <Button bsStyle='primary' onClick={(e) => this.handleClick(e)}>确定</Button>
              </Modal.Footer>

            </Modal.Dialog>
          </div>
        </div>
      </div>
    );
  }
}

SubmitButton.propTypes = {
  userAnswer: PropTypes.string.isRequired
};

const mapStateToProps = ({quiz}) => {
  return {
    paperInfo: quiz.paperInfo,
    userAnswer: quiz.userAnswer
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmitButton);
