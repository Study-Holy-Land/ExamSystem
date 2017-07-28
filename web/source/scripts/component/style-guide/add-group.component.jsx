'use strict';

var AddGroup = React.createClass({

  render () {
    return (
      <div>
        <div className="col-md-3 col-sm-4 col-xs-6 text-center">
          <div className="avatar"><a href="#">
            <span><i className="fa fa-plus text-success"/></span>
          </a></div>
          <div><a href="#">
            添加群组
          </a></div>
        </div>
      </div>
    );
  }
});

module.exports = AddGroup;