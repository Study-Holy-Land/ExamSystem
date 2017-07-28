'use strict';

require('./libs/outdatedBrowserCheck');
var Reflux = require('reflux');

require('../less/logic-puzzle.less');
require('../less/get-account.less');
require('lightbox2/dist/css/lightbox.min.css');
require('lightbox2/dist/js/lightbox.min.js');

var LogicPuzzle = require('./component/logic-puzzle/logic-puzzle-app.jsx');
var LogicPuzzleLeft = require('./component/logic-puzzle/logic-puzzle-left.component.jsx');
var LogicPuzzleSidebar = require('./component/logic-puzzle/logic-puzzle-sidebar.component.jsx');
var LogicPuzzleBoxes = require('./component/logic-puzzle/logic-puzzle-boxes.component.jsx');
var LogicPuzzleChart = require('./component/logic-puzzle/logic-puzzle-chart.component.jsx');
var LogicPuzzleDescription = require('./component/logic-puzzle/logic-puzzle-description.component.jsx');
var LogicPuzzleAnswerSubmit = require('./component/logic-puzzle/logic-puzzle-answer-submit.component.jsx');
var LogicPuzzleTimer = require('./component/logic-puzzle/logic-puzzle-timer.component.jsx');
var LogicPuzzleActions = require('./actions/logic-puzzle/logic-puzzle-actions');
var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');
var LogicPuzzleStore = require('./store/logic-puzzle/logic-puzzle-store');


$('#submitModal').on('show.bs.modal', function () {
  $('.modal-content')
    .css('margin-top', '230px');
});

function handleTimeOver() {
  LogicPuzzleActions.timeOver();
}
var LogicPuzzleApp = React.createClass({
  mixins: [Reflux.connect(LogicPuzzleStore)],

  componentDidMount: function () {
    LogicPuzzleActions.init();
    window.onpopstate = LogicPuzzleActions.init;
  },

  render: function () {
    return (
      <div>
        <header>
          <Navigation>
            <Account />
          </Navigation>
        </header>
        <LogicPuzzle>
          <div className="col-md-3 col-sm-4">
            <LogicPuzzleSidebar>
              <LogicPuzzleTimer onTimeOver={handleTimeOver}/>
            </LogicPuzzleSidebar>
          </div>
          <div className="col-md-9 col-sm-8">
            <LogicPuzzleLeft>
              <LogicPuzzleBoxes/>
              <LogicPuzzleChart/>
              <LogicPuzzleDescription/>
              <LogicPuzzleAnswerSubmit/>
            </LogicPuzzleLeft>
          </div>
        </LogicPuzzle>
      </div>
    )
  }
});

ReactDOM.render(<LogicPuzzleApp />, document.getElementById('answer-react'));
