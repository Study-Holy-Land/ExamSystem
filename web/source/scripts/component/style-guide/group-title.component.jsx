'use strict';

var GroupTitle = React.createClass({

  getInitialState: function () {
    return ({
      titleName: this.props.titleName || '群组首页'
    })
  },
  render() {
    return (
      <div className="group-title">
        <h4>{this.state.titleName}</h4>
        <hr/>
      </div>
    );
  }
});

module.exports = GroupTitle;
