'use strict';

var LogicPuzzleLeft = React.createClass({

  render: function () {
    return (
      <div id="logic-puzzle">
        {this.props.children}
      </div>
    );
  }
});

module.exports = LogicPuzzleLeft;
