'use strict';

var GroupEvent = React.createClass({

  getInitialState: function () {
    return ({
      items: [
        {
          avatar: require('../../../images/1.pic_hd.jpg'),
          name: '某某某',
          type: 'user',
          time: '04/01/2016 10:22',
          action: '发布了一条评论',
          content: '这道题好难这道题好难这道题好难这道题好难这道题好难这道题好难这道题好难这道题好难'
        },
        {
          avatar: require('../../../images/1.pic_hd.jpg'),
          name: '某某某',
          type: 'admin',
          time: '04/01/2016 10:22',
          action: '增加了一张新试卷 《面向对象 Step By Step》',
          content: ''
        },
        {
          avatar: require('../../../images/1.pic_hd.jpg'),
          name: '某某某',
          type: 'user',
          time: '04/01/2016 10:22',
          action: '加入了群组',
          content: ''
        },
        {
          avatar: require('../../../images/1.pic_hd.jpg'),
          name: '某某某',
          type: 'user',
          time: '04/01/2016 10:22',
          action: '完成了试卷《集合运算》',
          content: ''
        }
      ]
    })
  },

  render() {

    var eventList = this.state.items.map((item, index) => {
      return (
        <div className="col-md-12 col-sm-12 col-xs-12 group-event" key={index}>
          <h5>
            <div className="user-avatar">
              <img src={item.avatar}/>
            </div>
            <div className="event-info">
              <em>{item.type === 'admin' ? '管理员:' : ''}</em>{item.name}
              <small>{item.time}</small>
              <span>{item.action}</span>
            </div>
          </h5>
          { item.content !== '' ?
            <p className="col-md-2 col-sm-4 col-xs-6">
              <a href="#">{item.content}</a>
            </p> :
            null
          }
          <hr className="col-md-12 col-sm-12 col-xs-12"/>
        </div>
      );
    });

    return (
      <div>
        {eventList}
      </div>
    );
  }
});

module.exports = GroupEvent;
