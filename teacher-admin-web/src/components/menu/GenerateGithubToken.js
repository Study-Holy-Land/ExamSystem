import {Component} from 'react';
import superagent from 'superagent';
import constant from '../../../mixin/constant';
import noCache from 'superagent-no-cache';
import errorHandler from '../../tool/errorHandler';

export default class GenerateToken extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isGithubTokenNull: false,
      isNotFound: false
    };
  }

  componentDidMount() {
    superagent
        .get(API_PREFIX + '/github-token')
        .use(noCache)
        .use(errorHandler)
        .end((err, res) => {
          if (err && res.statusCode === constant.httpCode.NOT_FOUND) {
            this.setState({isNotFound: true});
          } else if (err) {
            throw err;
          }
          if (res.statusCode === constant.httpCode.OK) {
            this.githubToken.value = res.body.githubToken;
          }
        });
  }

  saveGithubToken() {
    this.setState({isNotFound: false});
    const githubToken = this.githubToken.value;
    const id = 1;
    const data = {githubToken, id};
    if (githubToken === '') {
      this.setState({isGithubTokenNull: true});
    } else {
      this.setState({isGithubTokenNull: false});
      superagent
          .put(API_PREFIX + '/github-token')
          .send(data)
          .end((err, res) => {
            if (err) {
              throw err;
            } else if (res.statusCode === constant.httpCode.NO_CONTENT) {
              this.setState({isNotFound: false});
            }
          });
    }
  }

  render() {
    return (
        <div>
          <div className='prompt'>请输入您获取到的githubToken(用于更新Jenkins的配置)</div>
          <div className='input-githubToken col-sm-6'>
            <input type='text' className='form-control' ref={(ref) => {
              this.githubToken = ref;
            }}/>
          </div>
          <button type='submit' className='btn btn-primary' onClick={this.saveGithubToken.bind(this)}>更改</button>
          <div className={this.state.isGithubTokenNull === true ? 'warning-info' : 'hide'}>githubToken不能为空</div>
          <div className={this.state.isNotFound === true ? 'warning-info' : 'hide'}>请先存入一个githubToken</div>
        </div>
    );
  }
}
