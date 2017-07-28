import {Component} from 'react';
import '../../style/home.less';
import GenerateGithubToken from './GenerateGithubToken';

export default class Home extends Component {
  render() {
    return (
      <div id='home'>
        <h1 className='text-center' style={{color: '#438EB9'}}>
          系统配置
        </h1>
        <div className='generate-token row'>
          <GenerateGithubToken/>
        </div>
      </div>
    );
  }
}
