'use strict';

require('../less/start.less');
require('../less/get-account.less');

var StartInfo = require('./component/start-info/start-info.component.jsx');
var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');
var StartActions = require('./actions/start/start-actions');
var StartStore = require('./store/start/start-store');
var Reflux = require('reflux');

var Start = React.createClass({
  mixins: [Reflux.connect(StartStore)],

  componentDidMount: function () {
    StartActions.init();
    window.onpopstate = StartActions.init;
  },

  render: function () {
    return (
      <div>
        <header>
          <Navigation>
            <Account />
          </Navigation>
        </header>
        <StartInfo />
      </div>
    )
  }
});

ReactDom.render(<Start />, document.getElementById('start-container'));
