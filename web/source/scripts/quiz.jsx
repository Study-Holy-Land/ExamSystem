import React from 'react';
import {Component} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import Quiz from './component/quiz/quiz';
import Navigation from './component/navigation/navigation.component.jsx';
import Account from './component/reuse/get-account.component.jsx';
import rootReducer from './reducers/index';

require('../less/paper-list.less');
require('../less/get-account.less');
require('../less/quiz.less');

const store = createStore(
    rootReducer,
    applyMiddleware(createLogger(), thunkMiddleware));

render(
    <Provider store={store}>
      <div id='paper'>
        <header>
          <Navigation>
            <Account />
          </Navigation>
        </header>
        <Quiz/>
      </div>
    </Provider>,
    document.getElementById('quiz'));