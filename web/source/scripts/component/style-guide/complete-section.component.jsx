'use strict';

var CompleteSection = React.createClass({
  getInitialState: function () {
    return {
      sectionName: '编程题'
    }
  },

  render: function () {
    return (
      <div className="dashboard-icon col-md-12 col-sm-12 col-xs-12">
        <div className="icon col-md-12 col-sm-12 col-xs-12">
          <div className="icon-img icon-complete">
              <span>
              <i className="fa fa-hand-peace-o "/>
              </span>
          </div>
          <p className="icon-name">{this.state.sectionName}</p>
        </div>
      </div>

    )
  }
});

module.exports = CompleteSection;