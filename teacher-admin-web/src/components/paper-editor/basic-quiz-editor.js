import {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import superagent from 'superagent';

import BasicBlankQuiz from './basic-blank-quiz';
import SingleChoice from './single-choice';
import MultipleChoice from './multiple-choice';
import ErrorTip from './error-tip';

const basicType = {
  0: BasicBlankQuiz,
  1: SingleChoice,
  2: MultipleChoice
};

export default class BasicQuizEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicQuizType: 0,
      basicQuiz: {
        description: '',
        answer: '',
        type: 'BASIC_BLANK_QUIZ'
      },
      quizError: '',
      quizType: [{
        text: '填空题',
        value: 'blankQuiz',
        defaultChecked: 'defaultChecked',
        basicQuiz: {
          description: '',
          answer: '',
          type: 'BASIC_BLANK_QUIZ'
        }
      }, {
        text: '单选题',
        value: 'singleChoice',
        defaultChecked: '',
        basicQuiz: {
          description: '',
          answer: '',
          options: ['', '', '', ''],
          type: 'SINGLE_CHOICE'
        }
      }, {
        text: '多选题',
        value: 'multipleChoice',
        defaultChecked: '',
        basicQuiz: {
          description: '',
          answer: '',
          options: ['', '', '', ''],
          type: 'MULTIPLE_CHOICE'
        }
      }]
    };
  }

  reset() {
    this.setState({
      basicQuizType: 0,
      basicQuiz: {
        description: '',
        answer: '',
        type: 'BASIC_BLANK_QUIZ'
      },
      quizError: '',
      quizType: [{
        text: '填空题',
        value: 'blankQuiz',
        defaultChecked: 'defaultChecked',
        basicQuiz: {
          description: '',
          answer: '',
          type: 'BASIC_BLANK_QUIZ'
        }
      }, {
        text: '单选题',
        value: 'singleChoice',
        defaultChecked: '',
        basicQuiz: {
          description: '',
          answer: '',
          options: ['', '', '', ''],
          type: 'SINGLE_CHOICE'
        }
      }, {
        text: '多选题',
        value: 'multipleChoice',
        defaultChecked: '',
        basicQuiz: {
          description: '',
          answer: '',
          options: ['', '', '', ''],
          type: 'MULTIPLE_CHOICE'
        }
      }]

    });
  }

  updateQuizError(basicQuiz, basicQuizType) {
    this.setState({
      quizError: '',
      basicQuiz,
      basicQuizType
    });
  }

  updateBasicQuiz(basicQuiz) {
    this.setState({
      basicQuiz
    });
  }

  checkBasicBlankQuiz({description, answer}) {
    if (description && answer) {
      return true;
    }
    return false;
  }

  checkChoice({options, description, answer}) {
    let item = options.find((item) => item === '');
    if (item === undefined && description && answer) {
      return {error: false};
    }
    if (item === '') {
      return {error: '选项未填写完整'};
    }
    if (!description) {
      return {error: '描述未填写'};
    }
    if (!answer) {
      return {error: '答案未填写'};
    }
  }

  close(sectionIndex) {
    this.props.updateState(sectionIndex);
    this.reset();
  }

  apiRequest(uri, data, done) {
    superagent
      .post(uri)
      .send(data)
      .end(done);
  }

  checkQuizError(basicQuiz) {
    if (basicQuiz.type === 'BASIC_BLANK_QUIZ') {
      return this.checkBasicBlankQuiz(basicQuiz);
    } else {
      return this.checkChoice(basicQuiz);
    }
  }

  submitBasicQuiz() {
    const basicQuiz = this.state.basicQuiz;
    const quizError = this.checkQuizError(basicQuiz);
    this.setState({
      basicQuiz,
      quizError: (quizError.error) ? quizError.error : ''
    });

    if (!quizError.error) {
      let uri = '';
      if (this.state.basicQuiz.type === 'BASIC_BLANK_QUIZ') {
        uri = 'basic-blank-quizzes';
      } else if (this.state.basicQuiz.type === 'SINGLE_CHOICE') {
        uri = 'single-choices';
      } else {
        uri = 'multiple-choices';
      }

      this.apiRequest(API_PREFIX + `/${uri}`, this.state.basicQuiz, (err, res) => {
        if (err) {
          throw (err);
        }
        this.props.addBasicQuiz({sectionIndex: this.props.sectionIndex, basicQuiz: res.body});
        this.props.editPaper({hasUnsavedChanges: true});
        this.close(this.props.sectionIndex);
      });
    }
  }

  render() {
    let Quiz = basicType[this.state.basicQuizType];

    return (
      <div className='static-modal'>
        <Modal show={this.props.isShowBasicQuizEditor} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <label>新建简单客观题</label>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <div className='quiz-type'>
                {
                  this.state.quizType.map(({text, value, defaultChecked, basicQuiz}, index) => {
                    return (
                      <div className='col-sm-2' key={index}>
                        <label className='radio-inline'>
                        <input type='radio' name='inlineRadioOptions' value={value} defaultChecked={defaultChecked}
                               onClick={this.updateQuizError.bind(this, basicQuiz, index)}/>
                        <label>{text}</label>
                        </label>
                      </div>
                    );
                  })
                }
              </div>
              <Quiz basicQuiz={this.state.basicQuiz} updateBasicQuiz={this.updateBasicQuiz.bind(this)}/>
              <ErrorTip error={this.state.quizError}/>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle='primary' onClick={this.submitBasicQuiz.bind(this)}>确定</Button>
          </Modal.Footer>

        </Modal>
      </div>
    );
  }
}
