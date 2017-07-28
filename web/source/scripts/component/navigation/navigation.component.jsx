'use strict';

require('../../../images/Logo_white.png');
var page = require('page');

var Navigation = React.createClass({

  goToPaperList: function () {
    page('paper-list.html');
  },

  render: function () {
    return (
      <nav>
        <div className="brand">
          <img src="build/Logo_white.png" onClick={this.goToPaperList}/>
        </div>
        {this.props.children}
      </nav>
    );
  }
});

module.exports = Navigation;
