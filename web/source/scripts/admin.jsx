'use strict';

require('../less/admin.less');
require('../less/get-account.less');

var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');
var Registerable = require('./component/admin/registerable.jsx');
var Channel = require('./component/admin/channel.jsx');
var QAPageUpdate = require('./component/admin/qa-page-update.jsx');
var ExportGrades = require('./component/admin/export-grades.jsx');

ReactDOM.render(
  <div>
    <header>
      <Navigation>
        <Account />
      </Navigation>
    </header>
    <div className="row">
      <div className="col-md-8 col-md-offset-2 center-content">
        <Registerable/>
        <Channel/>
        <QAPageUpdate/>
        <ExportGrades/>
      </div>
    </div>
  </div>,
  document.getElementById('admin-container')
);
