'use strict';
require('../less/index.less');
require('../less/get-account.less');

var Account = require('./component/reuse/get-account.component.jsx');
var ScrollToTop = require('react-scroll-up');
var getQueryString = require('../../tools/getQueryString');

var style = {
  position: 'fixed',
  bottom: 400,
  right: 30,
  cursor: 'pointer',
  transitionDuration: '0.2s',
  transitionTimingFunction: 'linear',
  transitionDelay: '0s'
};
var showUnder = 600;

var Index = React.createClass({
  componentWillMount: function () {
    var channel = getQueryString('channel');
    if (channel) {
      document.cookie = `channel=` + channel;
    } else {
      document.cookie = `channel=` + '';
    }
    var program = getQueryString('program');
    if (program) {
      document.cookie = `program=` + program;
    }
  },
  render: function () {
    return (
      <div>
        <Account state="index"/>
        <ScrollToTop showUnder={showUnder} style={style}>
          <div id="scroll-button">
            <i className="fa fa-angle-double-up fa-2x"></i>
          </div>
        </ScrollToTop>
      </div>
    )
  }
});

ReactDom.render(<Index />, document.getElementById('head-right'));
