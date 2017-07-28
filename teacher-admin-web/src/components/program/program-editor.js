import {Component} from 'react';
import superagent from 'superagent';
import validate from 'validate.js';
import errorHandler from '../../tool/errorHandler';
import noCache from 'superagent-no-cache';

let tabsConfiguration = [
  {value: '新增'},
  {value: '修改'}
];

class ErrorTip extends Component {
  render() {
    return (
      <span className='error-tip'>{this.props.error}</span>
    );
  }
}

export default class ProgramEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formEnable: true,
      programName: '',
      programDescription: '',
      programDescriptionError: '',
      codeEnable: true,
      programNameError: '',
      uriEnable: true,
      programId: '',
      currentProgram: {name: '', uriEnable: true, codeEnable: true, programType: 'exam', _id: ''},
      activeIndex: 0,
      certainEnable: true,
      programType: 'exam',
      typeEnable: true
    };
  }

  componentDidUpdate() {
    if (this.state.codeEnable) {
      this.refs.codeEnable.checked = true;
    } else {
      this.refs.codeDisabled.checked = true;
    }
  }

  updateName() {
    const programName = this.programName.value.trim();
    if (!programName) {
      this.setState({
        programNameError: '名称不能为空'
      });
    } else {
      superagent.get(API_PREFIX + '/programs')
        .use(noCache)
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          const sameName = res.body.programList.find(pro => pro.name === programName);
          if (sameName) {
            this.setState({
              programNameError: '名称已存在'
            });
          } else {
            this.setState({
              programName,
              programNameError: ''
            });
          }
        });
    }
  }

  updateDescription() {
    const programDescription = this.programDescription.value.trim();
    if (!programDescription) {
      this.setState({
        programDescriptionError: '描述不能为空'
      });
    } else {
      this.setState({
        programDescriptionError: ''
      });
    }
  }

  handleTabsToggle(index) {
    if (index === 0) {
      this.programName.value = '';
      this.programDescription.value = '';
      this.setState({
        programName: '',
        programDescription: '',
        uriEnable: true,
        formEnable: true,
        codeEnable: true,
        activeIndex: index,
        certainEnable: true,
        programType: 'exam',
        typeEnable: true
      });
    } else if (this.props.currentProgram._id !== '') {
      this.programName.value = this.props.currentProgram.name;
      this.programDescription.value = this.props.currentProgram.description;
      this.setState({
        programName: this.props.currentProgram.name,
        programDescription: this.props.currentProgram.description,
        uriEnable: this.props.currentProgram.uriEnable,
        codeEnable: this.props.currentProgram.codeEnable,
        programType: this.props.currentProgram.programType,
        typeEnable: false,
        formEnable: true,
        activeIndex: index,
        certainEnable: true
      });
    } else {
      this.setState({
        typeEnable: false,
        formEnable: false,
        activeIndex: index
      });
    }
  }

  codeSelected() {
    if (this.refs.codeEnable.checked) {
      this.setState({
        codeEnable: true,
        uriEnable: true
      });
    } else {
      this.setState({
        codeEnable: false,
        uriEnable: false
      });
    }
  }

  changeType() {
    if (this.practice.checked === true) {
      this.setState({
        programType: this.practice.value
      });
    } else {
      this.setState({
        programType: this.exam.value
      });
    }
  }

  checkedType(type) {
    return type === this.state.programType;
  }

  receivePropsData(programName, programDescription) {
    this.programName.value = programName;
    this.programDescription.value = programDescription;
  }

  componentWillReceiveProps(next) {
    if (next.currentProgram._id) {
      this.receivePropsData(next.currentProgram.name, next.currentProgram.description);
      this.setState({
        activeIndex: 1,
        formEnable: true,
        certainEnable: true,
        typeEnable: false,
        programName: next.currentProgram.name,
        programDescription: next.currentProgram.description,
        uriEnable: next.currentProgram.uriEnable,
        codeEnable: next.currentProgram.codeEnable,
        programType: next.currentProgram.programType,
        programId: next.currentProgram._id
      });
    }
  }

  validateInput() {
    const constraints = {
      programName: {
        presence: {
          message: '^名称不能为空'
        }
      },
      programDescription: {
        presence: {
          message: '^描述不能为空'
        }
      }
    };

    const programName = this.programName.value;
    const programDescription = this.programDescription.value;
    const errorInputMessage = validate({programName, programDescription}, constraints);
    const validateResult = {};

    for (let key in errorInputMessage) {
      validateResult[key + 'Error'] = errorInputMessage[key][0];
    }
    return errorInputMessage ? validateResult : undefined;
  }

  submit() {
    if (this.validateInput()) {
      this.setState(this.validateInput);
    } else {
      superagent.get(API_PREFIX + '/programs')
        .use(noCache)
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          let info = {
            name: this.programName.value,
            description: this.programDescription.value,
            uriEnable: this.state.codeEnable,
            codeEnable: this.state.codeEnable,
            programType: this.state.programType
          };
          if (this.state.activeIndex === 1) {
            const sameName = res.body.programList.find(pro => pro.name === this.programName.value && pro._id !== this.state.programId);
            if (sameName) {
              this.setState({
                programNameError: '名称已存在'
              });
            } else {
              superagent.put(API_PREFIX + `/programs/${this.state.programId}`)
                .send(info)
                .use(errorHandler)
                .end((err, res) => {
                  if (err) {
                    throw err;
                  } else {
                    Object.assign(info, {_id: this.state.programId});
                    this.props.updateProgram(info);
                    this.setState({
                      certainEnable: false
                    });
                  }
                });
            }
          } else {
            const sameName = res.body.programList.find(pro => pro.name === this.programName.value);
            if (sameName) {
              this.setState({
                programNameError: '名称已存在'
              });
            } else {
              superagent.post(API_PREFIX + '/programs')
                .send(info)
                .use(errorHandler)
                .end((err, res) => {
                  if (err) {
                    throw err;
                  } else {
                    this.props.addProgram(res.body);
                    this.programName.value = '';
                    this.programDescription.value = '';
                    this.setState({
                      programName: '',
                      programDescription: ''
                    });
                  }
                });
            }
          }
        });
    }
  }

  formEnable() {
    return this.state.formEnable ? '' : 'disabled';
  }

  typeEnable() {
    return this.state.typeEnable ? '' : 'disabled';
  }

  checkFormEnable() {
    return !this.state.formEnable || this.state.programType === 'exam' ? 'disabled' : '';
  }

  onFocus(err) {
    var errObj = {};
    errObj[err] = '';

    this.setState(errObj);
  }

  render() {
    const tabs = tabsConfiguration.map((tab, index) => {
      let active = this.state.activeIndex === index ? 'btn-primary' : 'btn-default';
      return (
        <div className='btn-group' role='group' key={index}>
          <button type='button' className={'btn ' + active}
                  onClick={this.handleTabsToggle.bind(this, index)}>{tab.value}</button>
        </div>
      );
    });
    return (
      <div className='tab-ul'>

        <div className='btn-group btn-group-justified tab-padding' role='group'>
          {tabs}
        </div>

        <div id='program-editor' className='form-horizontal'>
          <div className='form-group'>
            <label className='col-sm-5 control-label'>邀请码名称</label>
            <div className='col-sm-6'>
              <input type='text' className='form-control' disabled={this.formEnable()}
                     placeholder='邀请码名称'
                     ref={(ref) => {
                       this.programName = ref;
                     }}
                     onFocus={this.onFocus.bind(this, 'programNameError')}
              />
              <ErrorTip error={this.state.programNameError}/>
            </div>
            <label className='col-sm-5 control-label'>邀请码描述</label>
            <div className='col-sm-6'>
                <textarea className='form-control' disabled={this.formEnable()}
                          placeholder='邀请码描述'
                          ref={(ref) => {
                            this.programDescription = ref;
                          }}
                          onFocus={this.onFocus.bind(this, 'programDescriptionError')}
                />
              <ErrorTip error={this.state.programDescriptionError}/>
            </div>
          </div>

          <div className='form-group'>
            <label className='col-sm-5 control-label'>永久邀请码</label>
            <div className='col-sm-6'>
              <label className='radio-inline'>
                <input type='radio' name='program-code' disabled={this.formEnable()} ref='codeEnable'
                       onChange={this.codeSelected.bind(this)}
                />启用
              </label>
              <label className='radio-inline'>
                <input type='radio' name='program-code' disabled={this.formEnable()} ref='codeDisabled'
                       onChange={this.codeSelected.bind(this)}
                />禁用
              </label>
            </div>
          </div>

          <div className='form-group'>
            <label className='col-sm-5 control-label'>program 类型</label>
            <div className='col-sm-6'>
              <label className='radio-inline'>
                <input type='radio' name='program-type' value='exam' disabled={this.typeEnable()}
                       checked={this.checkedType('exam')}
                       ref={(ref) => {
                         this.exam = ref;
                       }}
                       onChange={this.changeType.bind(this)}
                />考试
              </label>
              <label className='radio-inline'>
                <input type='radio' name='program-type' value='practice' disabled={this.typeEnable()}
                       checked={this.checkedType('practice')}
                       ref={(ref) => {
                         this.practice = ref;
                       }}
                       onChange={this.changeType.bind(this)}
                />练习
              </label>
            </div>
          </div>

          <div className='form-group text-center'>
            <button className='btn btn-primary btn-size'
                    disabled={this.state.formEnable && this.state.certainEnable ? '' : 'disabled'}
                    onClick={this.submit.bind(this)}>确定
            </button>
          </div>
        </div>
      </div>
    );
  }
}
