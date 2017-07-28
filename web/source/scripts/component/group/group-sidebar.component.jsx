'use strict';

var ListGroup = require('../style-guide/list-group.component.jsx');

var GroupSidebar = React.createClass({

  render() {
    return (
      <div className="col-md-3">
        <ListGroup />
      </div>
    );
  }
});

module.exports = GroupSidebar;