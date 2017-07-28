'use strict';


require('./libs/outdatedBrowserCheck');
require('../less/dashboard.less');
require('../less/get-account.less');

var Dashboard = require('./component/dashboard/dashboard.component.jsx');
var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');
var Row = require('react-bootstrap/lib/Row');
var DashboardIcon = require('./component/dashboard/dashboard-icon.component.jsx');
var DashboardActions = require('./actions/dashboard/dashboard-actions');
var DashboardStore = require('./store/dashboard/dashboard-store');
var Reflux = require('reflux');

var DashboardApp = React.createClass({
  mixins: [Reflux.connect(DashboardStore)],

  getInitialState: function () {
    return {
      isGetStatus: false
    }
  },


  componentDidMount: function () {
    DashboardActions.init();
    window.onpopstate = DashboardActions.init;
  },

  render: function () {
    return (
      <div>
        <header>
          <Navigation>
            <Account />
          </Navigation>
        </header>
        <Dashboard isGetStatus={this.state.isGetStatus}>
          <h3 className="tip">请更新并使用最新版本的 Firefox 或 Chrome 浏览器，否则可能导致答题失败！</h3>
          <Row>
            {/*<DashboardIcon name="logic"/>*/}
            <DashboardIcon/>
            {/*<Arrow/>*/}
            {/*<DashboardIcon name="homework"/>*/}
          </Row>
        </Dashboard>
      </div>
    )
  }
});

ReactDom.render(<DashboardApp />, document.getElementById('dashboard-container'));
