require('../less/paper-list.less');
require('../less/get-account.less');
require('../less/toastr.less');
require('../less/animate.less');

var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');
var PaperListPage = require('./component/paper-list/index.jsx');


var PaperList = React.createClass({
  render: function () {
    return (
      <div>
        <header>
          <Navigation>
            <Account/>
          </Navigation>
        </header>
        <div>
          <PaperListPage/>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<PaperList/>, document.getElementById('paper-list'));