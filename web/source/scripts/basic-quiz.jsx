require('./libs/outdatedBrowserCheck');
require('../less/dashboard.less');
require('../less/get-account.less');

var BasicQuizApp = require('./component/basic-quiz/basic-quiz-app.jsx');
var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');

var BasicQuiz = React.createClass({
  render: function () {
    return (
      <div id="basic-quiz">
        <header>
          <Navigation>
            <Account/>
          </Navigation>
        </header>
        <div>
          <BasicQuizApp/>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<BasicQuiz/>, document.getElementById('basic-quiz'));