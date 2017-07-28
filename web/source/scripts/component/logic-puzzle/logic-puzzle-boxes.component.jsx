'use strict';

var Reflux = require('reflux');
var LogicPuzzleStore = require('../../store/logic-puzzle/logic-puzzle-store');

var LogicPuzzleBoxes = React.createClass({
  mixins: [Reflux.connect(LogicPuzzleStore)],

  getInitialState: function () {
    return {
      item: {
        initializedBox: []
      }
    };
  },

  render: function () {

    return (
      <div className="logic-title">
        <div className="box">
          <div>BoxNo.</div>
          <ol>
            {this.state.item.initializedBox.filter((val, key) => {
              return key > 0;
            }).map((box, idx) => {
              return (
                <li key={idx}>
                  <div>{idx + 1}</div>
                  <div className="num">{box}</div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }
});

module.exports = LogicPuzzleBoxes;
