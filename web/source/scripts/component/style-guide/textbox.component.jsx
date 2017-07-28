'use strict';

var TextBox = React.createClass({

  getInitialState: function () {
    return {
      content: this.props.content
    }
  },

  render() {
    return (
      <textarea className="textarea"
                value={this.state.content}
                readOnly={this.props.readonly ? 'readonly' : ''}/>
    );
  }
});

module.exports = TextBox;