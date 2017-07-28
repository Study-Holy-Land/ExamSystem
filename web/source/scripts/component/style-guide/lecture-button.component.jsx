'use strict';

var LectureButton = React.createClass({
  getInitialState: function () {
    return {
      isPublished: false,
      role: 1,
      lecture: 'logic'
    }
  },

  render: function () {
    var lecture = {
      logic: {
        title: '逻辑题',
        icon: 'fa fa-codepen'
      },
      homework: {
        title: '编程题',
        icon: 'fa fa-code'
      }
    };
    return (
      <div className="dashboard-icon col-md-12 col-sm-12 col-xs-12">
        <div className="icon col-md-12 col-sm-12 col-xs-12">
          <div className="icon-img">
            <span className={lecture[this.state.lecture].icon}></span>
          </div>
          <p className="icon-name">{lecture[this.state.lecture].title}</p>
          <div className="icon-bottom col-md-12 col-sm-12 col-xs-12">
            <div
              className={"col-md-4 col-sm-4 col-xs-3 text-left" + (this.state.isPublished ? ' text-success' : ' text-danger')}>
              {this.state.isPublished ? '已发布' : '未发布'}
            </div>
            <div
              className={"published-option col-md-8 col-sm-8 col-xs-9 text-right" + (this.state.role === 1 ? '' : ' hide')}>
              <a href="#" className="published">发布</a>
              <a href="#" className="edit">编辑</a>
              <a href="#" className="delete">删除</a>
            </div>
            <a href="#"
               className={"col-md-8 col-sm-8 col-xs-9 text-right" + (this.state.role === 1 ? ' hide' : '')}>查看</a>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = LectureButton;