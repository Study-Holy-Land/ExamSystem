import {Component} from 'react';
import '../../style/paper-edit.less';
import errorHandler from '../../tool/errorHandler';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';

export default class PaperInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programList: [],
      currentProgramId: 1
    };
  }

  editPaperName() {
    this.props.editPaper({paperName: this.paperName.value, hasUnsavedChanges: true});
  }

  editDescription() {
    this.props.editPaper({description: this.description.value, hasUnsavedChanges: true});
  }

  editProgram() {
    const index = document.getElementById('programs').selectedIndex;
    const program = this.state.programList[index];
    const programId = program && program.programId ? program.programId : '';
    this.setState({
      currentProgramId: programId
    }, () => {
      this.props.updateProgramType(program.programType);
      this.props.editPaper({programId, hasUnsavedChanges: true});
    });
  }

  receivePropsData() {
    this.paperName.value = this.props.paperName || '';
    this.description.value = this.props.description || '';
  }

  componentDidMount() {
    this.receivePropsData();

    superagent.get(API_PREFIX + '/programs')
      .use(noCache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({
          programList: res.body.programList
        });
      });
  }

  componentDidUpdate() {
    this.receivePropsData();
  }

  componentWillReceiveProps(next) {
    if (next.programId) {
      this.setState({
        currentProgramId: next.programId
      });
    } else if (this.state.programList.length > 0) {
      this.props.editPaper({programId: this.state.programList[0].programId});
    }
  }

  judgeSelected(program) {
    if (this.state.currentProgramId === program.programId) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const programList = this.state.programList;
    const programOptions = programList.map((program, index) => {
      let selected = this.judgeSelected(program);
      return <option key={index} selected={selected}>
        {program.name}
      </option>;
    });
    return (
      <div id='paper-info'>
        <div className='paper-body'>
          <div className='form-group row'>
            <label className='col-sm-3 control-label'> 试卷名称 </label>
            <div className='col-sm-6'>
              <input type='text' className='form-control' placeholder='请输入试卷名称'
                     ref={(ref) => {
                       this.paperName = ref;
                     }} onBlur={this.editPaperName.bind(this)}
                     disabled={this.props.isDistributed}/>
            </div>
          </div>

          <div className='form-group row'>
            <label className='col-sm-3 control-label'> 试卷描述 </label>
            <div className='col-sm-6'>
              <textarea type='text'
                        className='form-control'
                        placeholder='请输入试卷描述'
                        ref={(ref) => {
                          this.description = ref;
                        }} disabled={this.props.isDistributed}
                        onBlur={this.editDescription.bind(this)}/>
            </div>
          </div>

          <div className='form-group row'>
            <label className='col-sm-3 control-label'> program </label>
            <div className='col-sm-6'>
              <select id='programs' className='form-control' disabled={this.props.isDistributed}
                      onChange={this.editProgram.bind(this)}>
                {programOptions}
              </select>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
