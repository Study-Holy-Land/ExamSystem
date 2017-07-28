import {Component} from 'react';
import '../../style/login.less';
import Title from './Title';
import LoginForm from './LoginForm';

export default class Login extends Component {
  render() {
    return (
      <div>
        <Title />
        <LoginForm />
      </div>
    );
  }
}
