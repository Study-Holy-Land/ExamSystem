import {Component} from 'react';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import StackList from './stack-list';
import StackEditor from './stack-editor';

let pollTimeout;

export default class StackBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stacks: [],
      stack: {}
    };
  }

  requestStacks() {
    superagent
      .get(API_PREFIX + '/stack-definitions')
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({
          stacks: res.body.items
        });
      });
  }

  hasTaskProcess(status) {
    return status === 0;
  }

  pollData(stack) {
    this.requestStacks();
    if (this.hasTaskProcess(stack.status)) {
      pollTimeout = setTimeout(this.onInit(stack._id), 5000);
    } else {
      pollTimeout && clearTimeout(pollTimeout);
    }
  }

  onInit(stackId) {
    superagent
      .get(API_PREFIX + `/stack-definitions/status/${stackId}`)
      .use(noCache)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({stack: res.body});
        this.pollData(res.body);
      });
  }

  componentDidMount() {
    this.requestStacks();
  }

  componentDidUpdate() {
    this.runningResult.scrollTop = this.runningResult.scrollHeight;
  }

  render() {
    return (
      <div className='stack-body row'>
        <div className='col-sm-8'>
          <StackList stacks={this.state.stacks}/>
          <div className={'row ' + (this.state.stack.status === 0 ? '' : 'warning-message')}>
            <div className='add-stack-result col-sm-10 col-sm-offset-1' ref={(ref) => {
              this.runningResult = ref;
            }}>
              {this.state.stack.result}
              <br/>
              <i className='fa fa-spinner fa-pulse fa-3x fa-fw'></i>
            </div>
          </div>
        </div>
        <div className='col-sm-4'>
          <StackEditor pollData={this.pollData.bind(this)}/>
        </div>
      </div>
    );
  }
}
