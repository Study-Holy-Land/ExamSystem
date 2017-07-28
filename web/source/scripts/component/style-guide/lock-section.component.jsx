'use strict';

var LockSection = React.createClass({

  render: function () {
    return (
      <div className="dashboard-icon col-md-12 col-sm-12 col-xs-12">
        <div className="icon col-md-12 col-sm-12 col-xs-12">
          <div className="icon-img icon-lock">
              <span>
              <i className="fa fa-lock text-muted"/>
              </span>
          </div>
          <p className="icon-lock-name text-muted">请等待管理员解锁</p>
        </div>
      </div>
    )
  }
});

module.exports = LockSection;