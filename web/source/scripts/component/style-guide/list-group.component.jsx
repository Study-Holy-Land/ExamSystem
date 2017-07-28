'use strict';

var ListGroup = React.createClass({

  getInitialState: function () {
    return ({
      title: '个人中心',
      list: ['群组首页', '群组试卷', '群组成员', '群组管理'],
      clickNumber: 1
    })
  },

  handleClick: function (clickNumber) {
    this.setState({
      clickNumber: clickNumber
    });
  },

  render() {

    var listContent = this.state.list.map((item, index) => {
      var classStr = "list-group-item " + (this.state.clickNumber === index + 1 ? 'select' : '');
      return (
        <button className={classStr} key={index} onClick={this.handleClick.bind(null, index + 1)}>
          <div className="row">
            <div className="h4 text-center">{item}</div>
          </div>
        </button>
      )
    });

    return (
      <div>
        <div className="list-group">
          <div className="list-group-item active">
            <div className="row">
              <div className="h4 text-center">{this.state.title}</div>
            </div>
          </div>
          {listContent}
        </div>
      </div>
    );
  }
});
module.exports = ListGroup;