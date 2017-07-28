'use strict';

var UploadAvatar = React.createClass({
  getInitialState() {
    return {
      avatar: ''
    }
  },
  render (){
    return (
      <div className="upload-avatar col-md-12 col-sm-12 col-xs-12">
        <div className="avatar">
          {this.state.avatar !== '' ?
            <img src={this.state.avatar}/> :
            <span><i className="fa fa-user"/></span>
          }
        </div>
        <div className="upload">
          <span><a href="#">
            <i className="fa fa-camera"/>修改头像
          </a></span>
        </div>
      </div>
    );
  }
});

module.exports = UploadAvatar;