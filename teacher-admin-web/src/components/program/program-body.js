import {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import ProgramList from './program-list';
import ProgramEditor from './program-editor';
import errorHandler from '../../tool/errorHandler';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import {PaginationWrapper} from '../common';

class ProgramBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programList: [],
      pageCount: 15,
      currentPage: 1,
      totalPage: 0,
      currentProgram: {name: '', uriEnable: true, codeEnable: true, orderEnable: true, _id: ''}
    };
  }

  componentDidMount() {
    const page = parseInt(this.props.uri.query.page) || 1;
    this.getProgramList(page);
  }

  getProgramList(page) {
    this.setState({currentPage: page || this.state.currentPage});
    superagent.get(API_PREFIX + '/programs')
      .use(noCache)
      .use(errorHandler)
      .query({
        currentPage: page,
        pageCount: this.state.pageCount
      })
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({
          programList: res.body.programList,
          totalPage: res.body.totalPage
        });
      });
  }

  changeState(program) {
    this.setState({
      currentProgram: program
    });
  }

  addProgram(program) {
    let programList = this.state.programList;
    if (this.state.currentPage === this.state.totalPage) {
      programList.push(program);
      this.setState({
        programList,
        currentProgram: {
          name: '',
          description: '',
          uriEnable: true,
          codeEnable: true,
          orderEnable: true,
          programType: 'exam',
          _id: ''
        }
      });
    }
  }

  updateProgram(program) {
    let programList = this.state.programList;
    this.state.programList.forEach(pro => {
      if (pro._id === program._id) {
        Object.assign(pro, program);
      }
    });

    this.setState({
      programList,
      currentProgram: {name: '', uriEnable: true, codeEnable: true, orderEnable: true, programType: 'exam', _id: ''}
    });
  }

  render() {
    return (<div className='program-body row'>
      <div className='col-sm-8'>
        <ProgramList changeState={this.changeState.bind(this)}
                     programs={this.state.programList}/>
        <div className='program-pagination'>
          <PaginationWrapper totalPage={this.state.totalPage}
                             currentPage={this.state.currentPage}
                             onPageChange={this.getProgramList.bind(this)}/>
        </div>
      </div>
      <div className='col-sm-4'>
        <ProgramEditor currentProgram={this.state.currentProgram}
                       addProgram={this.addProgram.bind(this)}
                       updateProgram={this.updateProgram.bind(this)}/>

      </div>

    </div>);
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(withRouter(ProgramBody));
