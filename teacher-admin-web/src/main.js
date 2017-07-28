import {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory, IndexRoute, withRouter} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers/index.js';
import {Provider, connect} from 'react-redux';
import createLogger from 'redux-logger';
import PaperList from './components/paper-list/PaperList';
import Layout from './containers/menu/layout';
import PaperEditor from './containers/paper-editor';
import Login from './components/Login';
import Mentor from './components/Mentor';
import Homework from './components/homework/Homework';
import HomeworkEditor from './components/HomeworkEditor';
import Home from './components/menu/Home';
import UserCenter from './components/menu/UserCenter';
import Messages from './components/messages/';
import RoleManagement from './components/roleManagement';
import {cookie} from 'react-cookie-banner';
import Stack from './components/stack';
import Program from './components/program';
import BasicQuiz from './containers/basic-quiz';
import CheManagement from './components/cheManagement';

const store = createStore(
  rootReducer,
  applyMiddleware(createLogger(), thunkMiddleware)
);

class Main extends Component {
  requireCookie(nextState, replace, next) {
    let authState = cookie('authState');
    if (authState !== '200') {
      replace(URI_PREFIX + '/login');
      next();
    }
    next();
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path={URI_PREFIX + '/login'} component={Login}/>
        <Route path={URI_PREFIX + '/'} component={Layout} onEnter={this.requireCookie}>
          <IndexRoute component={UserCenter}/>
          <Route path='index' component={Home}/>
          <Route path='userCenter' component={UserCenter}/>
          <Route path='mentor' component={Mentor}/>
          <Route path='messageCenter'>
            <IndexRoute component={Messages}/>
          </Route>
          <Route path='papers'>
            <IndexRoute component={PaperList}/>
            <Route path='?page=page' component={PaperList}/>
            <Route path='edit' component={PaperEditor}/>
            <Route path=':id/edit' component={PaperEditor}/>
            <Route path=':id/preview' component={PaperEditor}/>
            <Route path='new' component={PaperEditor}/>
          </Route>
          <Route path='homeworks'>
            <IndexRoute component={Homework}/>
            <Route path='?page=page' component={HomeworkEditor}/>
            <Route path='edit' component={HomeworkEditor}/>
            <Route path=':id/edit' component={HomeworkEditor}/>
            <Route path='new' component={HomeworkEditor}/>
          </Route>
          <Route path='roleManagement'>
            <IndexRoute component={RoleManagement}/>
          </Route>
          <Route path='stacks'>
            <IndexRoute component={Stack}/>
          </Route>
          <Route path='programs'>
            <IndexRoute component={Program}/>
          </Route>
          <Route path='basicQuiz'>
            <IndexRoute component={BasicQuiz}/>
          </Route>
          <Route path='che'>
            <IndexRoute component={CheManagement}/>
          </Route>
        </Route>
      </Router>
    );
  }
}

const mapStateToProps = (state) => state;

let RootApp = connect(mapStateToProps)(withRouter(Main));

render(
  <Provider store={store}>
    <RootApp/>
  </Provider>,
  document.getElementById('app'));
