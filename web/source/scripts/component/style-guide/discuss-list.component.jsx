'use strict';

var DiscussList = React.createClass({
  getInitialState: function () {
    return ({
      discussionList: [
        {
          avatar: require('../../../images/1.pic_hd.jpg'),
          name: '某某某',
          time: '04/01/2016 10:22',
          discussion: '这道题好难这道题好难这道题好难这道题好难这道题好难这道题好难这道题好难这道题好难'
        },
        {
          avatar: '',
          name: '李煜',
          time: '04/01/2016 10:22',
          discussion: '这道题好难这道题好难这道题好难这道题好难这道题好难这道题好难这道题好难这道题好难'
        }
      ]
    });
  },
  render() {
    var discussionList = this.state.discussionList.map((item, index) => {
      return (
        <div className="col-md-12 col-sm-12 col-xs-12 group-event" key={index}>
          <h5>
            <div className="user-avatar">
              {item.avatar !== '' ?
                <img src={item.avatar}/> :
                <span><i className="fa fa-user"/></span>
              }
            </div>
            <div className="event-info">
              {item.name}
              <small>{item.time}</small>
            </div>
          </h5>
          <p className="col-md-2 col-sm-4 col-xs-6 discuss">
            {item.discussion}
          </p>
          <hr className="col-md-12 col-sm-12 col-xs-12"/>
        </div>
      );
    });
    return (
      <div>
        {discussionList}
      </div>
    );
  }
});
module.exports = DiscussList;