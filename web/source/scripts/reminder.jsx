'use strict';

require('../less/paper-list.less');
require('../less/get-account.less');
require('../less/toastr.less');
require('../less/animate.less');
require('../less/reminder.less');

var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');

var Reminder = React.createClass({
  render: function () {
    return (
      <div>
        <header>
          <Navigation>
            <Account />
          </Navigation>
        </header>
        <div className="text-center reminder-info">
          <h3>恭喜您已答完本张试卷所有题目！</h3>
          <h3>点击下方按钮可返回试卷列表</h3>
          <div className="form-group">
            <div className='col-sm-offset-4 col-sm-4 col-md-offset-4 col-md-4'>
              <button className="btn btn-lg btn-block btn-primary btn">返回</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

ReactDom.render(<Reminder />, document.getElementById('reminder'));
