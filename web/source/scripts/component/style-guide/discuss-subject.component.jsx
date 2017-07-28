'use strict';

var DiscussSubject = React.createClass({
  getInitialState: function () {
    return ({
      subjectList: [
        {
          isMe: true,
          userName: '某某某',
          time: '04/01/2016 10:22',
          subject: '阿里的罚金老师的罚款了世界的科阿里的罚金老师的罚款了世界的科阿里的罚金老师的罚款了世界的科阿里的罚金老师的罚款了世界的科阿里的罚金老师的罚款了世界的科阿里的罚金老师的罚款了世界的科阿里的罚金老师的罚款了世界的科阿里的罚金老师的罚款了世界的科'
        },
        {
          isMe: false,
          userName: '某某某',
          time: '04/01/2016 10:22',
          subject: '阿里的罚金老师的罚款了世界的科'
        }
      ]
    });
  },
  render() {

    var subjectList = this.state.subjectList.map((item, index) => {
      var operateCls = "operate col-md-2 col-sm-2 col-xs-2" + (item.isMe ? '' : ' unvisible');
      return (
        <div className="discuss-subject col-md-12 col-sm-12 col-xs-12" key={index}>
          <div className="content col-md-10 col-sm-10 col-xs-10">
            <h5 className="col-md-12 col-sm-12 col-xs-12">
              {item.isMe ? '我' : item.userName}
              <small>{item.time}</small>
            </h5>
            <p className="col-md-10 col-sm-9 col-xs-6">
              <a>{item.subject}</a>
            </p>
          </div>
          <div className={operateCls}>
            <a href="#">编辑</a>
            <a href="#">删除</a>
          </div>
          <hr className="col-md-12 col-sm-12 col-xs-12"/>
        </div>
      );
    });
    return (
      <div>
        {subjectList}
      </div>
    )
  }
});

module.exports = DiscussSubject;