import {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import superagent from 'superagent';

import BasicBlankQuiz from './basic-blank-quiz';
import SingleChoice from './single-choice';
import MultipleChoice from './multiple-choice';
import ErrorTip from './error-tip';

const quizType = [{
  text: '填空题',
  value: 'blankQuiz',
  basicQuiz: {
    description: '',
    answer: '',
    type: 'BASIC_BLANK_QUIZ'
  }
}, {
  text: '单选题',
  value: 'singleChoice',
  basicQuiz: {
    description: '',
    answer: '',
    options: ['', '', '', ''],
    type: 'SINGLE_CHOICE'
  }
}, {
  text: '多选题',
  value: 'multipleChoice',
  basicQuiz: {
    description: '',
    answer: '',
    options: ['', '', '', ''],
    type: 'MULTIPLE_CHOICE'
  }
}];

const basicType = {
  'BASIC_BLANK_QUIZ': BasicBlankQuiz,
  'SINGLE_CHOICE': SingleChoice,
  'MULTIPLE_CHOICE': MultipleChoice
};

const basicsType = {
  'basicBlankQuizzes': 'basic-blank-quizzes',
  'singleChoices': 'single-choices',
  'multipleChoices': 'multiple-choices'
};

export default class UpdateBasicQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicQuiz: {},
      quizError: ''
    };
  }

  componentWillReceiveProps(next) {
    const uri = next.data.uri;
    if (uri) {
      const uriArray = uri.split('/');
      superagent
        .get(API_PREFIX + `/${basicsType[uriArray[0]]}/${uriArray[1]}`)
        .end((err, res) => {
          if (err) {
            return err;
          }
          this.setState({
            basicQuiz: res.body
          });
        });
    }
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
      return true;
    }
    return false;
  }

  close(data) {
    this.props.replaceBasicQuiz(data);
  }

  submitBasicQuiz() {
    const basicQuiz = this.state.basicQuiz;
    let quizError;
    if (basicQuiz.type === 'BASIC_BLANK_QUIZ') {
      quizError = this.checkBasicBlankQuiz(basicQuiz);
    } else {
      quizError = this.checkChoice(basicQuiz);
    }

    this.setState({
      basicQuiz,
      quizError: quizError ? '' : '该题未填写完整'
    }, () => {
      if (quizError) {
        const uriArray = this.props.data.uri.split('/');
        superagent
          .put(API_PREFIX + `/${basicsType[uriArray[0]]}/${uriArray[1]}`)
          .send(this.state.basicQuiz)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            this.props.onReplaceBasicQuiz({
              sectionIndex: this.props.data.sectionIndex,
              homeworkQuizIndex: this.props.data.homeworkQuizIndex,
              quiz: res.body
            });
            this.props.editPaper({hasUnsavedChanges: true});
            this.close(this.props.data);
          });
      }
    });
  }

  render() {
    let Quiz = basicType[this.state.basicQuiz.type];
    return (
      <div className='static-modal'>
        <Modal show={this.props.isShowBasicQuizUpdate} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <label>编辑简单客观题</label>
            </Modal.Title>

          </Modal.Header>

          <Modal.Body>
            <div>
              <div className='quiz-type'>
                {
                  quizType.map(({text, value, basicQuiz}, index) => {
                    let checked = this.state.basicQuiz.type === basicQuiz.type ? 'checked' : '';
                    return (
                      <div className='col-sm-2' key={index}>
                        <input type='radio' name='radio' value={value} checked={checked} disabled='disabled'/>
                        <label>{text}</label>
                      </div>
                    );
                  })
                }
              </div>
              {
                this.state.basicQuiz.type
                  ? <Quiz basicQuiz={this.state.basicQuiz} updateBasicQuiz={this.updateBasicQuiz.bind(this)}/> : ''
              }
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
