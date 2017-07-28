'use strict';

var Reflux = require('reflux');
var LogicPuzzleStore = require('../../store/logic-puzzle/logic-puzzle-store');

var LogicPuzzleDescription = React.createClass({
  mixins: [Reflux.connect(LogicPuzzleStore)],

  getInitialState: function () {
    return {
      item: {
        description: [],
        question: ''
      }
    };
  },

  render: function () {
    return (
      <div className="right-description">
        <ol>
          {this.state.item.description.filter((val) => {
            return val !== '';
          }).map((description, idx) => {
            return (
              <li key={idx}>
                <div>{description}</div>
              </li>
            );
          })}
        </ol>

        <div className="question">{this.state.item.question}</div>
        {
          this.state.isExample ?
            <ul className="example">
              <li>此</li>
              <li>题</li>
              <li>为</li>
              <li>例</li>
              <li>题</li>
            </ul> :
            null
        }

      </div>
    );
  }
});

module.exports = LogicPuzzleDescription;
