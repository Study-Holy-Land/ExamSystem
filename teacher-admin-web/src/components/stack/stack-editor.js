import {Component} from 'react';
import superagent from 'superagent';

class ErrorTip extends Component {
  render() {
    return (
      <span className='error-tip'>{this.props.error}</span>
    );
  }
}

export default class StackEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      definition: '',
      titleError: '',
      definitionError: '',
      inputState: ''
    };
  }

  updateTitle() {
    const title = this.name.value.trim();
    if (title) {
      this.setState({
        title,
        titleError: ''
      });
    } else {
      this.setState({
        titleError: '名称不能为空'
      });
    }
  }

  updateDescription() {
    this.setState({
      description: this.description.value.trim()
    });
  }

  updateDefinition() {
    const definition = this.definition.value.trim();
    let definitions = definition.split(':');
    if (definitions.length === 2 && definitions[1]) {
      this.setState({
        definition,
        definitionError: ''
      });
    } else {
      this.setState({
        definitionError: definition ? 'Image 输入不合法' : 'Image 不能为空'
      });
    }
  }

  createStack() {
    if (this.state.inputState === 'disabled' || this.state.definitionError || this.state.titleError) {
      return;
    }

    if (this.state.title && this.state.definition) {
      this.setState({
        inputState: 'disabled'
      });
      superagent
        .post(API_PREFIX + '/stack-definitions')
        .send({
          title: this.state.title,
          definition: this.state.definition,
          description: this.state.description
        })
        .end((err, res) => {
          if (res.statusCode === 400 || res.statusCode === 404) {
            this.setState({
              titleError: '',
              definitionError: 'Image 有误',
              inputState: ''
            });
          } else if (res.statusCode === 409) {
            this.setState({
              titleError: '名称已存在',
              inputState: ''
            });
          } else {
            this.name.value = '';
            this.description.value = '';
            this.definition.value = '';
            this.setState({
              inputState: ''
            });
            this.props.pollData(res.body);
          }
          if (err) {
            throw err;
          }
        });
    } else {
      this.setState({
        titleError: '名称不能为空',
        definitionError: 'Image 不能为空'
      });
    }
  }

  resetDefinitionError() {
    this.setState({
      definitionError: ''
    });
  }

  resetNameError() {
    this.setState({
      titleError: ''
    });
  }

  render() {
    return (
      <div className='stack-editor'>
        <div className='form-horizontal'>
          <div className='form-group'>
            <button className='btn btn-white btn-primary form-control'>添加</button>
          </div>
          <div className='form-group'>
            <label className='col-sm-3 control-label'>名称</label>
            <div className='col-sm-9'>
              <input type='text'
                     disabled={this.state.inputState}
                     className='form-control'
                     placeholder='名称'
                     ref={(ref) => {
                       this.name = ref;
                     }}
                     onBlur={this.updateTitle.bind(this)}
                     onFocus={this.resetNameError.bind(this)}/>
              <ErrorTip error={this.state.titleError}/>
            </div>
          </div>

          <div className='form-group'>
            <label className='col-sm-3 control-label'>描述</label>
            <div className='col-sm-9'>
              <textarea type='text'
                        disabled={this.state.inputState}
                        className='form-control'
                        placeholder='描述'
                        ref={(ref) => {
                          this.description = ref;
                        }}
                        onBlur={this.updateDescription.bind(this)}/>
            </div>
          </div>

          <div className='form-group'>
            <label className='col-sm-3 control-label'>Image</label>
            <div className='col-sm-9'>
              <input type='text'
                     disabled={this.state.inputState}
                     className='form-control'
                     placeholder='例如：node:6.9.4'
                     ref={(ref) => {
                       this.definition = ref;
                     }}
                     onBlur={this.updateDefinition.bind(this)}
                     onFocus={this.resetDefinitionError.bind(this)}/>
              <ErrorTip error={this.state.definitionError}/>
            </div>
          </div>

          <div className='form-group'>
            <div className='col-sm-4 col-sm-offset-4'>
              <button className={'btn btn-white btn-primary form-control ' + this.state.inputState}
                      onClick={this.createStack.bind(this)}>
                确定 <i className={this.state.inputState === '' ? '' : 'fa fa-spinner fa-spin'}></i>
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
