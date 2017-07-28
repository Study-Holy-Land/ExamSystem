'use strict';

var DiscussSubject = require('../style-guide/discuss-subject.component.jsx');
var DiscussFrame = require('../style-guide/discuss-frame.component.jsx');

var GroupDiscussion = React.createClass({

  render() {
    return (
      <div>
        <DiscussSubject />
        <div className="col-md-10 col-md-offset-1">
          <DiscussFrame />
        </div>
      </div>
    );
  }
});

module.exports = GroupDiscussion;