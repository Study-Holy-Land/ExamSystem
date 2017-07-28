'use strict';

var GroupAvatar = React.createClass({

  getInitialState: function () {
    return {
      groupName: this.props.groupName || '前端学习群',
      groupAvatar: this.props.groupAvatar || ''

    }
  },

  render () {
    return (
      <div className="col-md-12 col-sm-12 col-xs-12 text-center">
        <div className="avatar"><a href="#">
          {this.state.groupAvatar !== '' ?
            <img src={this.state.groupAvatar}/> :
            <span><i className="fa fa-group"/></span>
          }
        </a></div>
        <div className="avatar-name"><a href="#">
          {this.state.groupName}
        </a></div>
      </div>
    );
  }
});

module.exports = GroupAvatar;